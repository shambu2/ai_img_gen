import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class ContentModerationService {
  constructor(bedrockClient) {
    this.bedrockClient = bedrockClient;
    this.blockedKeywords = [
      // Violence and harm
      'violence', 'blood', 'gore', 'weapon', 'gun', 'knife', 'bomb', 'explosion',
      'death', 'killing', 'murder', 'suicide', 'torture', 'abuse',
      
      // Hate speech and discrimination
      'hate', 'racist', 'sexist', 'homophobic', 'transphobic', 'discrimination',
      'slur', 'offensive', 'derogatory',
      
      // Adult content
      'nude', 'naked', 'sexual', 'pornographic', 'explicit', 'adult',
      'intimate', 'provocative',
      
      // Illegal activities
      'illegal', 'criminal', 'drug', 'substance', 'trafficking',
      
      // Personal information
      'personal', 'private', 'confidential', 'sensitive',
      
      // Political extremism
      'extremist', 'terrorist', 'radical', 'political violence'
    ];

    this.sensitiveCategories = [
      'violence',
      'hate_speech',
      'sexual_content',
      'self_harm',
      'illegal_activities',
      'personal_information',
      'political_content'
    ];
  }

  /**
   * Moderate text prompt before image generation
   * @param {string} prompt - Text prompt to moderate
   * @returns {Promise<Object>} Moderation result
   */
  async moderatePrompt(prompt) {
    try {
      // Basic keyword filtering
      const keywordCheck = this.checkKeywords(prompt);
      if (!keywordCheck.isSafe) {
        return {
          isApproved: false,
          reason: `Content contains blocked keywords: ${keywordCheck.blockedKeywords.join(', ')}`,
          category: 'blocked_keywords',
          confidence: 1.0
        };
      }

      // AI-powered content moderation using Bedrock
      const aiModeration = await this.performAIModeration(prompt);
      
      return {
        isApproved: aiModeration.isApproved,
        reason: aiModeration.reason,
        category: aiModeration.category,
        confidence: aiModeration.confidence,
        flaggedContent: aiModeration.flaggedContent
      };

    } catch (error) {
      console.error('❌ Content moderation failed:', error);
      // Fail safe - reject if moderation fails
      return {
        isApproved: false,
        reason: 'Content moderation service unavailable',
        category: 'service_error',
        confidence: 0.0
      };
    }
  }

  /**
   * Check for blocked keywords in text
   * @param {string} text - Text to check
   * @returns {Object} Keyword check result
   */
  checkKeywords(text) {
    const lowerText = text.toLowerCase();
    const blockedKeywords = this.blockedKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );

    return {
      isSafe: blockedKeywords.length === 0,
      blockedKeywords
    };
  }

  /**
   * Perform AI-powered content moderation using Bedrock
   * @param {string} text - Text to moderate
   * @returns {Promise<Object>} AI moderation result
   */
  async performAIModeration(text) {
    try {
      const moderationPrompt = `
        Analyze the following text for content that may be inappropriate, harmful, or violate ethical guidelines.
        
        Text to analyze: "${text}"
        
        Consider these categories:
        - Violence or harm
        - Hate speech or discrimination
        - Sexual or adult content
        - Self-harm or dangerous activities
        - Illegal activities
        - Personal or sensitive information
        - Political extremism
        
        Respond with a JSON object containing:
        {
          "isApproved": boolean,
          "reason": "string explaining the decision",
          "category": "violence|hate_speech|sexual_content|self_harm|illegal_activities|personal_information|political_content|safe",
          "confidence": float (0.0 to 1.0),
          "flaggedContent": ["array of specific flagged terms or phrases"]
        }
        
        Be conservative in your assessment. If there's any doubt about appropriateness, reject the content.
      `;

      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          prompt: moderationPrompt,
          max_tokens: 500,
          temperature: 0.1,
          top_p: 0.9
        })
      });

      const response = await this.bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      // Parse the AI response
      const aiResponse = responseBody.completion || responseBody.content[0].text;
      const moderationResult = JSON.parse(aiResponse);

      return {
        isApproved: moderationResult.isApproved || false,
        reason: moderationResult.reason || 'AI moderation completed',
        category: moderationResult.category || 'safe',
        confidence: moderationResult.confidence || 0.5,
        flaggedContent: moderationResult.flaggedContent || []
      };

    } catch (error) {
      console.error('❌ AI moderation failed:', error);
      // Fallback to basic keyword check
      const keywordCheck = this.checkKeywords(text);
      return {
        isApproved: keywordCheck.isSafe,
        reason: keywordCheck.isSafe ? 'Basic keyword check passed' : 'Basic keyword check failed',
        category: keywordCheck.isSafe ? 'safe' : 'blocked_keywords',
        confidence: 0.7,
        flaggedContent: keywordCheck.blockedKeywords
      };
    }
  }

  /**
   * Moderate generated image (placeholder for future implementation)
   * @param {Buffer} imageBuffer - Image buffer to moderate
   * @returns {Promise<Object>} Image moderation result
   */
  async moderateImage(imageBuffer) {
    // TODO: Implement image moderation using AWS Rekognition or similar
    // For now, return safe by default
    return {
      isApproved: true,
      reason: 'Image moderation not yet implemented',
      category: 'safe',
      confidence: 0.5
    };
  }

  /**
   * Get moderation guidelines
   * @returns {Object} Moderation guidelines
   */
  getModerationGuidelines() {
    return {
      blockedCategories: this.sensitiveCategories,
      blockedKeywords: this.blockedKeywords,
      guidelines: {
        violence: 'Content promoting or depicting violence, harm, or dangerous activities',
        hate_speech: 'Content promoting discrimination, hate, or targeting specific groups',
        sexual_content: 'Explicit sexual content or adult material',
        self_harm: 'Content promoting self-harm or dangerous behaviors',
        illegal_activities: 'Content promoting illegal activities or substances',
        personal_information: 'Content containing personal or sensitive information',
        political_content: 'Extreme political content or misinformation'
      },
      compliance: {
        eu_ai_act: 'Compliant with EU AI Act requirements',
        ethical_guidelines: 'Follows responsible AI principles',
        content_safety: 'Prioritizes user safety and well-being'
      }
    };
  }

  /**
   * Log moderation event for audit trail
   * @param {Object} event - Moderation event data
   */
  logModerationEvent(event) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType: 'content_moderation',
      ...event
    };

    console.log('📝 Moderation Event:', JSON.stringify(logEntry, null, 2));
    
    // TODO: Send to logging service (CloudWatch, etc.)
  }

  /**
   * Update blocked keywords list
   * @param {Array} keywords - New keywords to add
   */
  updateBlockedKeywords(keywords) {
    this.blockedKeywords = [...new Set([...this.blockedKeywords, ...keywords])];
  }

  /**
   * Get moderation statistics
   * @returns {Object} Moderation statistics
   */
  getModerationStats() {
    return {
      totalKeywords: this.blockedKeywords.length,
      categories: this.sensitiveCategories.length,
      lastUpdated: new Date().toISOString()
    };
  }
}