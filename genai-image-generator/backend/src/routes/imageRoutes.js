import express from 'express';
import Joi from 'joi';

// Validation schemas
const generateImageSchema = Joi.object({
  prompt: Joi.string().required().min(1).max(1000).messages({
    'string.empty': 'Prompt is required',
    'string.max': 'Prompt must be less than 1000 characters'
  }),
  modelId: Joi.string().valid(
    'stability.stable-diffusion-xl-v1',
    'stability.stable-diffusion-xl-v0',
    'amazon.titan-image-generator-v1'
  ).default('stability.stable-diffusion-xl-v1'),
  size: Joi.string().pattern(/^\d+x\d+$/).default('1024x1024'),
  steps: Joi.number().integer().min(10).max(150).default(50),
  cfgScale: Joi.number().min(1).max(20).default(7.5),
  style: Joi.string().max(200).optional(),
  negativePrompt: Joi.string().max(500).optional()
});

const generateVariationsSchema = Joi.object({
  baseImageId: Joi.string().required(),
  count: Joi.number().integer().min(1).max(10).default(4),
  modelId: Joi.string().valid(
    'stability.stable-diffusion-xl-v1',
    'stability.stable-diffusion-xl-v0',
    'amazon.titan-image-generator-v1'
  ).default('stability.stable-diffusion-xl-v1')
});

export default function imageRoutes(imageGenerationService, s3Service, upload) {
  const router = express.Router();

  /**
   * @route POST /api/images/generate
   * @desc Generate image from text prompt
   * @access Private
   */
  router.post('/generate', async (req, res) => {
    try {
      // Validate request body
      const { error, value } = generateImageSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
      }

      const {
        prompt,
        modelId,
        size,
        steps,
        cfgScale,
        style,
        negativePrompt
      } = value;

      // Validate parameters with service
      const validation = imageGenerationService.validateParameters(value);
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: validation.errors
        });
      }

      console.log(`🎨 Generating image: "${prompt}" with ${modelId}`);

      // Generate image
      const result = await imageGenerationService.generateImage({
        prompt,
        modelId,
        size,
        steps,
        cfgScale,
        style,
        negativePrompt
      });

      // Convert base64 to buffer and upload to S3
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      const uploadResult = await s3Service.uploadImage(imageBuffer, {
        fileName: `${result.id}.jpg`,
        metadata: {
          prompt: result.prompt,
          modelId: result.modelId,
          size: result.size,
          steps: result.steps.toString(),
          cfgScale: result.cfgScale.toString(),
          style: result.style,
          negativePrompt: result.negativePrompt,
          generationTime: result.generationTime.toString()
        }
      });

      // Return response
      res.status(201).json({
        success: true,
        data: {
          id: result.id,
          prompt: result.prompt,
          modelId: result.modelId,
          size: result.size,
          url: uploadResult.url,
          presignedUrl: uploadResult.presignedUrl,
          generationTime: result.generationTime,
          timestamp: result.timestamp,
          metadata: {
            ...result.metadata,
            s3Key: uploadResult.key,
            fileSize: uploadResult.size
          }
        },
        message: 'Image generated successfully'
      });

    } catch (error) {
      console.error('❌ Image generation route error:', error);
      res.status(500).json({
        error: 'Image generation failed',
        message: error.message
      });
    }
  });

  /**
   * @route POST /api/images/variations
   * @desc Generate variations of an existing image
   * @access Private
   */
  router.post('/variations', async (req, res) => {
    try {
      // Validate request body
      const { error, value } = generateVariationsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
      }

      const { baseImageId, count, modelId } = value;

      console.log(`🔄 Generating ${count} variations for image: ${baseImageId}`);

      // Generate variations
      const variations = await imageGenerationService.generateVariations({
        baseImageId,
        count,
        modelId
      });

      // Upload variations to S3
      const uploadedVariations = [];
      for (const variation of variations) {
        const imageBuffer = Buffer.from(variation.imageData, 'base64');
        const uploadResult = await s3Service.uploadImage(imageBuffer, {
          fileName: `variation_${variation.id}.jpg`,
          metadata: {
            baseImageId,
            prompt: variation.prompt,
            modelId: variation.modelId,
            size: variation.size,
            generationTime: variation.generationTime.toString()
          }
        });

        uploadedVariations.push({
          id: variation.id,
          prompt: variation.prompt,
          url: uploadResult.url,
          presignedUrl: uploadResult.presignedUrl,
          generationTime: variation.generationTime,
          timestamp: variation.timestamp
        });
      }

      res.status(201).json({
        success: true,
        data: {
          baseImageId,
          count: uploadedVariations.length,
          variations: uploadedVariations
        },
        message: 'Variations generated successfully'
      });

    } catch (error) {
      console.error('❌ Variations generation route error:', error);
      res.status(500).json({
        error: 'Variations generation failed',
        message: error.message
      });
    }
  });

  /**
   * @route GET /api/images/models
   * @desc Get supported models and their capabilities
   * @access Private
   */
  router.get('/models', (req, res) => {
    try {
      const models = imageGenerationService.getSupportedModels();
      
      res.status(200).json({
        success: true,
        data: models,
        message: 'Supported models retrieved successfully'
      });

    } catch (error) {
      console.error('❌ Models route error:', error);
      res.status(500).json({
        error: 'Failed to retrieve models',
        message: error.message
      });
    }
  });

  /**
   * @route GET /api/images/list
   * @desc List generated images with pagination
   * @access Private
   */
  router.get('/list', async (req, res) => {
    try {
      const { page = 1, limit = 20, continuationToken } = req.query;

      const listResult = await s3Service.listImages({
        maxKeys: parseInt(limit),
        continuationToken
      });

      res.status(200).json({
        success: true,
        data: {
          images: listResult.images,
          pagination: {
            isTruncated: listResult.isTruncated,
            nextContinuationToken: listResult.nextContinuationToken,
            keyCount: listResult.keyCount,
            page: parseInt(page),
            limit: parseInt(limit)
          }
        },
        message: 'Images listed successfully'
      });

    } catch (error) {
      console.error('❌ List images route error:', error);
      res.status(500).json({
        error: 'Failed to list images',
        message: error.message
      });
    }
  });

  /**
   * @route GET /api/images/:key
   * @desc Get specific image by S3 key
   * @access Private
   */
  router.get('/:key', async (req, res) => {
    try {
      const { key } = req.params;

      const imageData = await s3Service.getImage(key);

      res.status(200).json({
        success: true,
        data: {
          key,
          contentType: imageData.contentType,
          size: imageData.size,
          lastModified: imageData.lastModified,
          metadata: imageData.metadata
        },
        message: 'Image retrieved successfully'
      });

    } catch (error) {
      console.error('❌ Get image route error:', error);
      res.status(500).json({
        error: 'Failed to retrieve image',
        message: error.message
      });
    }
  });

  /**
   * @route DELETE /api/images/:key
   * @desc Delete image by S3 key
   * @access Private
   */
  router.delete('/:key', async (req, res) => {
    try {
      const { key } = req.params;

      await s3Service.deleteImage(key);

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete image route error:', error);
      res.status(500).json({
        error: 'Failed to delete image',
        message: error.message
      });
    }
  });

  /**
   * @route POST /api/images/upload
   * @desc Upload and process existing image
   * @access Private
   */
  router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No image file provided'
        });
      }

      const { quality = 90, format = 'jpeg' } = req.body;

      // Process and upload image
      const uploadResult = await s3Service.uploadImage(req.file.buffer, {
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        quality: parseInt(quality),
        format,
        metadata: {
          originalName: req.file.originalname,
          originalSize: req.file.size.toString()
        }
      });

      res.status(201).json({
        success: true,
        data: {
          id: uploadResult.fileName,
          url: uploadResult.url,
          presignedUrl: uploadResult.presignedUrl,
          size: uploadResult.size,
          contentType: uploadResult.contentType,
          metadata: uploadResult.metadata
        },
        message: 'Image uploaded successfully'
      });

    } catch (error) {
      console.error('❌ Upload image route error:', error);
      res.status(500).json({
        error: 'Failed to upload image',
        message: error.message
      });
    }
  });

  /**
   * @route GET /api/images/stats
   * @desc Get image generation statistics
   * @access Private
   */
  router.get('/stats', async (req, res) => {
    try {
      const bucketStats = await s3Service.getBucketStats();

      res.status(200).json({
        success: true,
        data: {
          bucket: bucketStats,
          models: imageGenerationService.getSupportedModels()
        },
        message: 'Statistics retrieved successfully'
      });

    } catch (error) {
      console.error('❌ Stats route error:', error);
      res.status(500).json({
        error: 'Failed to retrieve statistics',
        message: error.message
      });
    }
  });

  return router;
}