import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export class ImageGenerationService {
  constructor(bedrockClient) {
    this.bedrockClient = bedrockClient;
    this.supportedModels = {
      'stability.stable-diffusion-xl-v1': {
        name: 'Stable Diffusion XL',
        maxTokens: 1000,
        maxImages: 1,
        supportedFormats: ['png', 'jpeg'],
        supportedSizes: ['1024x1024', '1152x896', '896x1152', '1216x832', '832x1216', '1344x768', '768x1344']
      },
      'stability.stable-diffusion-xl-v0': {
        name: 'Stable Diffusion XL v0',
        maxTokens: 1000,
        maxImages: 1,
        supportedFormats: ['png', 'jpeg'],
        supportedSizes: ['1024x1024', '1152x896', '896x1152', '1216x832', '832x1216', '1344x768', '768x1344']
      },
      'amazon.titan-image-generator-v1': {
        name: 'Titan Image Generator',
        maxTokens: 1000,
        maxImages: 1,
        supportedFormats: ['png', 'jpeg'],
        supportedSizes: ['1024x1024', '1024x1408', '1408x1024']
      }
    };
  }

  /**
   * Generate image from text prompt using AWS Bedrock
   * @param {Object} params - Generation parameters
   * @param {string} params.prompt - Text prompt for image generation
   * @param {string} params.modelId - Bedrock model ID
   * @param {string} params.size - Image size (e.g., '1024x1024')
   * @param {number} params.steps - Number of diffusion steps
   * @param {number} params.cfgScale - CFG scale for guidance
   * @param {string} params.style - Artistic style
   * @param {string} params.negativePrompt - Negative prompt
   * @returns {Promise<Object>} Generated image data
   */
  async generateImage(params) {
    const {
      prompt,
      modelId = 'stability.stable-diffusion-xl-v1',
      size = '1024x1024',
      steps = 50,
      cfgScale = 7.5,
      style = '',
      negativePrompt = ''
    } = params;

    try {
      // Validate model
      if (!this.supportedModels[modelId]) {
        throw new Error(`Unsupported model: ${modelId}`);
      }

      // Validate size
      const model = this.supportedModels[modelId];
      if (!model.supportedSizes.includes(size)) {
        throw new Error(`Unsupported size for ${modelId}: ${size}`);
      }

      // Enhance prompt with style if provided
      let enhancedPrompt = prompt;
      if (style) {
        enhancedPrompt = `${prompt}, ${style}`;
      }

      // Prepare request body based on model
      let requestBody;
      if (modelId.startsWith('stability.')) {
        requestBody = {
          text_prompts: [
            {
              text: enhancedPrompt,
              weight: 1
            }
          ],
          cfg_scale: cfgScale,
          steps: steps,
          seed: Math.floor(Math.random() * 2147483647),
          samples: 1,
          style_preset: style || "photographic"
        };

        if (negativePrompt) {
          requestBody.text_prompts.push({
            text: negativePrompt,
            weight: -1
          });
        }
      } else if (modelId.startsWith('amazon.titan')) {
        requestBody = {
          taskType: "TEXT_IMAGE",
          textToImageParams: {
            text: enhancedPrompt,
            negativeText: negativePrompt || "blurry, low quality, distorted, deformed"
          },
          imageGenerationConfig: {
            numberOfImages: 1,
            quality: "standard",
            cfgScale: cfgScale,
            height: parseInt(size.split('x')[1]),
            width: parseInt(size.split('x')[0]),
            seed: Math.floor(Math.random() * 2147483647)
          }
        };
      }

      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(requestBody)
      });

      console.log(`🎨 Generating image with ${modelId}: "${enhancedPrompt}"`);
      const startTime = Date.now();

      const response = await this.bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      const generationTime = Date.now() - startTime;
      console.log(`✅ Image generated in ${generationTime}ms`);

      // Extract image data based on model
      let imageData;
      if (modelId.startsWith('stability.')) {
        imageData = responseBody.artifacts[0].base64;
      } else if (modelId.startsWith('amazon.titan')) {
        imageData = responseBody.images[0];
      }

      return {
        id: uuidv4(),
        prompt: enhancedPrompt,
        modelId,
        size,
        steps,
        cfgScale,
        style,
        negativePrompt,
        imageData,
        generationTime,
        timestamp: new Date().toISOString(),
        metadata: {
          model: model.name,
          format: 'base64',
          size: size
        }
      };

    } catch (error) {
      console.error('❌ Image generation failed:', error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  /**
   * Generate multiple variations of an image
   * @param {Object} params - Generation parameters
   * @param {string} params.baseImageId - Base image ID for variations
   * @param {number} params.count - Number of variations to generate
   * @returns {Promise<Array>} Array of generated variations
   */
  async generateVariations(params) {
    const { baseImageId, count = 4, modelId = 'stability.stable-diffusion-xl-v1' } = params;

    try {
      const variations = [];
      for (let i = 0; i < count; i++) {
        const variation = await this.generateImage({
          ...params,
          prompt: `${params.prompt} (variation ${i + 1})`,
          seed: Math.floor(Math.random() * 2147483647)
        });
        variations.push(variation);
      }

      return variations;
    } catch (error) {
      console.error('❌ Variation generation failed:', error);
      throw new Error(`Variation generation failed: ${error.message}`);
    }
  }

  /**
   * Process and optimize generated image
   * @param {Buffer} imageBuffer - Raw image buffer
   * @param {Object} options - Processing options
   * @returns {Promise<Buffer>} Processed image buffer
   */
  async processImage(imageBuffer, options = {}) {
    const {
      width = 1024,
      height = 1024,
      quality = 90,
      format = 'jpeg'
    } = options;

    try {
      let processedImage = sharp(imageBuffer)
        .resize(width, height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        });

      if (format === 'jpeg') {
        processedImage = processedImage.jpeg({ quality });
      } else if (format === 'png') {
        processedImage = processedImage.png({ quality });
      } else if (format === 'webp') {
        processedImage = processedImage.webp({ quality });
      }

      return await processedImage.toBuffer();
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Get supported models and their capabilities
   * @returns {Object} Supported models information
   */
  getSupportedModels() {
    return this.supportedModels;
  }

  /**
   * Validate generation parameters
   * @param {Object} params - Parameters to validate
   * @returns {Object} Validation result
   */
  validateParameters(params) {
    const errors = [];

    if (!params.prompt || params.prompt.trim().length === 0) {
      errors.push('Prompt is required');
    }

    if (params.prompt && params.prompt.length > 1000) {
      errors.push('Prompt too long (max 1000 characters)');
    }

    if (params.steps && (params.steps < 10 || params.steps > 150)) {
      errors.push('Steps must be between 10 and 150');
    }

    if (params.cfgScale && (params.cfgScale < 1 || params.cfgScale > 20)) {
      errors.push('CFG scale must be between 1 and 20');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}