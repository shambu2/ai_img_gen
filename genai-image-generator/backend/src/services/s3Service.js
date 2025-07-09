import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
  constructor(s3Client) {
    this.s3Client = s3Client;
    this.bucketName = process.env.S3_BUCKET_NAME || 'genai-image-generator';
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.baseUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
  }

  /**
   * Upload image to S3 with optimization
   * @param {Buffer} imageBuffer - Image buffer to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadImage(imageBuffer, options = {}) {
    const {
      fileName = `${uuidv4()}.jpg`,
      contentType = 'image/jpeg',
      quality = 90,
      width = 1024,
      height = 1024,
      format = 'jpeg',
      metadata = {}
    } = options;

    try {
      // Process and optimize image
      const processedBuffer = await this.processImage(imageBuffer, {
        quality,
        width,
        height,
        format
      });

      // Generate unique key
      const key = `images/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`;

      // Prepare upload parameters
      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: processedBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000', // 1 year cache
        Metadata: {
          ...metadata,
          'original-size': imageBuffer.length.toString(),
          'processed-size': processedBuffer.length.toString(),
          'upload-timestamp': new Date().toISOString(),
          'image-format': format,
          'image-quality': quality.toString()
        }
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      // Generate presigned URL for immediate access
      const presignedUrl = await this.generatePresignedUrl(key, 'getObject', 3600); // 1 hour

      return {
        key,
        fileName,
        url: `${this.baseUrl}/${key}`,
        presignedUrl,
        size: processedBuffer.length,
        contentType,
        metadata: uploadParams.Metadata
      };

    } catch (error) {
      console.error('❌ S3 upload failed:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Process and optimize image before upload
   * @param {Buffer} imageBuffer - Raw image buffer
   * @param {Object} options - Processing options
   * @returns {Promise<Buffer>} Processed image buffer
   */
  async processImage(imageBuffer, options = {}) {
    const {
      quality = 90,
      width = 1024,
      height = 1024,
      format = 'jpeg'
    } = options;

    try {
      let processedImage = sharp(imageBuffer)
        .resize(width, height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        });

      // Apply format-specific optimizations
      if (format === 'jpeg') {
        processedImage = processedImage.jpeg({ 
          quality,
          progressive: true,
          mozjpeg: true
        });
      } else if (format === 'png') {
        processedImage = processedImage.png({ 
          quality,
          progressive: true,
          compressionLevel: 9
        });
      } else if (format === 'webp') {
        processedImage = processedImage.webp({ 
          quality,
          effort: 6
        });
      }

      return await processedImage.toBuffer();

    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Generate presigned URL for S3 object
   * @param {string} key - S3 object key
   * @param {string} operation - S3 operation (getObject, putObject)
   * @param {number} expiresIn - URL expiration time in seconds
   * @returns {Promise<string>} Presigned URL
   */
  async generatePresignedUrl(key, operation = 'getObject', expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });

    } catch (error) {
      console.error('❌ Presigned URL generation failed:', error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  /**
   * Get image from S3
   * @param {string} key - S3 object key
   * @returns {Promise<Object>} Image data
   */
  async getImage(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const response = await this.s3Client.send(command);
      const imageBuffer = await this.streamToBuffer(response.Body);

      return {
        buffer: imageBuffer,
        contentType: response.ContentType,
        metadata: response.Metadata,
        lastModified: response.LastModified,
        size: response.ContentLength
      };

    } catch (error) {
      console.error('❌ S3 get failed:', error);
      throw new Error(`Failed to retrieve image: ${error.message}`);
    }
  }

  /**
   * Delete image from S3
   * @param {string} key - S3 object key
   * @returns {Promise<boolean>} Deletion success
   */
  async deleteImage(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return true;

    } catch (error) {
      console.error('❌ S3 delete failed:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * List images in S3 bucket with pagination
   * @param {Object} options - List options
   * @returns {Promise<Object>} List result
   */
  async listImages(options = {}) {
    const {
      prefix = 'images/',
      maxKeys = 50,
      continuationToken = null
    } = options;

    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken
      });

      const response = await this.s3Client.send(command);

      const images = response.Contents?.map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: `${this.baseUrl}/${obj.Key}`
      })) || [];

      return {
        images,
        isTruncated: response.IsTruncated,
        nextContinuationToken: response.NextContinuationToken,
        keyCount: response.KeyCount
      };

    } catch (error) {
      console.error('❌ S3 list failed:', error);
      throw new Error(`Failed to list images: ${error.message}`);
    }
  }

  /**
   * Convert stream to buffer
   * @param {ReadableStream} stream - Stream to convert
   * @returns {Promise<Buffer>} Buffer
   */
  async streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  /**
   * Get S3 bucket statistics
   * @returns {Promise<Object>} Bucket statistics
   */
  async getBucketStats() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: 'images/'
      });

      const response = await this.s3Client.send(command);
      
      const totalSize = response.Contents?.reduce((sum, obj) => sum + obj.Size, 0) || 0;
      const totalImages = response.Contents?.length || 0;

      return {
        totalImages,
        totalSize,
        averageSize: totalImages > 0 ? totalSize / totalImages : 0,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Bucket stats failed:', error);
      throw new Error(`Failed to get bucket statistics: ${error.message}`);
    }
  }

  /**
   * Clean up old images (older than specified days)
   * @param {number} daysOld - Age threshold in days
   * @returns {Promise<number>} Number of deleted images
   */
  async cleanupOldImages(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: 'images/'
      });

      const response = await this.s3Client.send(command);
      const oldImages = response.Contents?.filter(obj => 
        obj.LastModified < cutoffDate
      ) || [];

      let deletedCount = 0;
      for (const image of oldImages) {
        try {
          await this.deleteImage(image.Key);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete ${image.Key}:`, error);
        }
      }

      return deletedCount;

    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw new Error(`Failed to cleanup old images: ${error.message}`);
    }
  }
}