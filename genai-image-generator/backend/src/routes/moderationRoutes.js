import express from 'express';
import Joi from 'joi';

// Validation schemas
const moderatePromptSchema = Joi.object({
  prompt: Joi.string().required().min(1).max(1000).messages({
    'string.empty': 'Prompt is required',
    'string.max': 'Prompt must be less than 1000 characters'
  })
});

export default function moderationRoutes(contentModerationService) {
  const router = express.Router();

  /**
   * @route POST /api/moderation/check
   * @desc Check if prompt is appropriate for image generation
   * @access Private
   */
  router.post('/check', async (req, res) => {
    try {
      // Validate request body
      const { error, value } = moderatePromptSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
      }

      const { prompt } = value;

      console.log(`🔍 Moderating prompt: "${prompt}"`);

      // Perform content moderation
      const moderationResult = await contentModerationService.moderatePrompt(prompt);

      // Log moderation event
      contentModerationService.logModerationEvent({
        prompt,
        result: moderationResult,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        data: {
          prompt,
          isApproved: moderationResult.isApproved,
          reason: moderationResult.reason,
          category: moderationResult.category,
          confidence: moderationResult.confidence,
          flaggedContent: moderationResult.flaggedContent || [],
          timestamp: new Date().toISOString()
        },
        message: moderationResult.isApproved 
          ? 'Content approved for generation' 
          : 'Content rejected due to policy violations'
      });

    } catch (error) {
      console.error('❌ Content moderation route error:', error);
      res.status(500).json({
        error: 'Content moderation failed',
        message: error.message
      });
    }
  });

  /**
   * @route POST /api/moderation/batch
   * @desc Check multiple prompts in batch
   * @access Private
   */
  router.post('/batch', async (req, res) => {
    try {
      const { prompts } = req.body;

      if (!Array.isArray(prompts) || prompts.length === 0) {
        return res.status(400).json({
          error: 'Prompts array is required and must not be empty'
        });
      }

      if (prompts.length > 10) {
        return res.status(400).json({
          error: 'Maximum 10 prompts allowed per batch'
        });
      }

      console.log(`🔍 Batch moderating ${prompts.length} prompts`);

      const results = [];
      for (const prompt of prompts) {
        try {
          const moderationResult = await contentModerationService.moderatePrompt(prompt);
          results.push({
            prompt,
            isApproved: moderationResult.isApproved,
            reason: moderationResult.reason,
            category: moderationResult.category,
            confidence: moderationResult.confidence,
            flaggedContent: moderationResult.flaggedContent || []
          });

          // Log each moderation event
          contentModerationService.logModerationEvent({
            prompt,
            result: moderationResult,
            batch: true,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          results.push({
            prompt,
            isApproved: false,
            reason: 'Moderation failed',
            category: 'error',
            confidence: 0.0,
            flaggedContent: []
          });
        }
      }

      const approvedCount = results.filter(r => r.isApproved).length;
      const rejectedCount = results.length - approvedCount;

      res.status(200).json({
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            approved: approvedCount,
            rejected: rejectedCount,
            approvalRate: (approvedCount / results.length) * 100
          },
          timestamp: new Date().toISOString()
        },
        message: `Batch moderation completed: ${approvedCount} approved, ${rejectedCount} rejected`
      });

    } catch (error) {
      console.error('❌ Batch moderation route error:', error);
      res.status(500).json({
        error: 'Batch moderation failed',
        message: error.message
      });
    }
  });

  /**
   * @route GET /api/moderation/guidelines
   * @desc Get content moderation guidelines and policies
   * @access Private
   */
  router.get('/guidelines', (req, res) => {
    try {
      const guidelines = contentModerationService.getModerationGuidelines();

      res.status(200).json({
        success: true,
        data: guidelines,
        message: 'Moderation guidelines retrieved successfully'
      });

    } catch (error) {
      console.error('❌ Guidelines route error:', error);
      res.status(500).json({
        error: 'Failed to retrieve guidelines',
        message: error.message
      });
    }
  });

  /**
   * @route GET /api/moderation/stats
   * @desc Get moderation statistics
   * @access Private
   */
  router.get('/stats', (req, res) => {
    try {
      const stats = contentModerationService.getModerationStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Moderation statistics retrieved successfully'
      });

    } catch (error) {
      console.error('❌ Stats route error:', error);
      res.status(500).json({
        error: 'Failed to retrieve statistics',
        message: error.message
      });
    }
  });

  /**
   * @route POST /api/moderation/update-keywords
   * @desc Update blocked keywords list (admin only)
   * @access Private
   */
  router.post('/update-keywords', async (req, res) => {
    try {
      const { keywords } = req.body;

      if (!Array.isArray(keywords)) {
        return res.status(400).json({
          error: 'Keywords must be an array'
        });
      }

      // Validate keywords
      const validKeywords = keywords.filter(keyword => 
        typeof keyword === 'string' && keyword.trim().length > 0
      );

      if (validKeywords.length === 0) {
        return res.status(400).json({
          error: 'No valid keywords provided'
        });
      }

      // Update blocked keywords
      contentModerationService.updateBlockedKeywords(validKeywords);

      console.log(`📝 Updated blocked keywords: ${validKeywords.join(', ')}`);

      res.status(200).json({
        success: true,
        data: {
          addedKeywords: validKeywords,
          totalKeywords: contentModerationService.blockedKeywords.length
        },
        message: 'Blocked keywords updated successfully'
      });

    } catch (error) {
      console.error('❌ Update keywords route error:', error);
      res.status(500).json({
        error: 'Failed to update keywords',
        message: error.message
      });
    }
  });

  /**
   * @route POST /api/moderation/test
   * @desc Test moderation with sample prompts
   * @access Private
   */
  router.post('/test', async (req, res) => {
    try {
      const testPrompts = [
        'A beautiful sunset over the ocean',
        'A peaceful forest scene with animals',
        'A futuristic city with flying cars',
        'A portrait of a happy family',
        'A delicious meal on a table',
        'A violent scene with weapons', // Should be blocked
        'A hateful message targeting groups', // Should be blocked
        'Explicit adult content', // Should be blocked
        'A professional business meeting',
        'A creative art piece'
      ];

      console.log('🧪 Running moderation test with sample prompts');

      const results = [];
      for (const prompt of testPrompts) {
        const moderationResult = await contentModerationService.moderatePrompt(prompt);
        results.push({
          prompt,
          isApproved: moderationResult.isApproved,
          reason: moderationResult.reason,
          category: moderationResult.category,
          confidence: moderationResult.confidence
        });
      }

      const approvedCount = results.filter(r => r.isApproved).length;
      const rejectedCount = results.length - approvedCount;

      res.status(200).json({
        success: true,
        data: {
          testPrompts: results,
          summary: {
            total: results.length,
            approved: approvedCount,
            rejected: rejectedCount,
            approvalRate: (approvedCount / results.length) * 100
          },
          timestamp: new Date().toISOString()
        },
        message: 'Moderation test completed successfully'
      });

    } catch (error) {
      console.error('❌ Test route error:', error);
      res.status(500).json({
        error: 'Moderation test failed',
        message: error.message
      });
    }
  });

  return router;
}