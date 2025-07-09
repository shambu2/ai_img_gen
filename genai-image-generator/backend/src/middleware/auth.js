/**
 * API Key validation middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validateApiKey = (req, res, next) => {
  try {
    // Get API key from headers
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'Please provide a valid API key in the X-API-Key header'
      });
    }

    // Validate API key format (basic validation)
    if (!isValidApiKeyFormat(apiKey)) {
      return res.status(401).json({
        error: 'Invalid API key format',
        message: 'API key format is invalid'
      });
    }

    // Check if API key is valid (in production, this would check against a database)
    if (!isValidApiKey(apiKey)) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid'
      });
    }

    // Add API key info to request object
    req.apiKey = apiKey;
    req.user = {
      id: extractUserIdFromApiKey(apiKey),
      permissions: getUserPermissions(apiKey)
    };

    next();

  } catch (error) {
    console.error('❌ API key validation error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during authentication'
    });
  }
};

/**
 * Check if API key format is valid
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if format is valid
 */
function isValidApiKeyFormat(apiKey) {
  // Basic format validation
  // In production, this would be more sophisticated
  return typeof apiKey === 'string' && 
         apiKey.length >= 32 && 
         apiKey.length <= 128 &&
         /^[a-zA-Z0-9_-]+$/.test(apiKey);
}

/**
 * Check if API key is valid
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if API key is valid
 */
function isValidApiKey(apiKey) {
  // In production, this would check against a database or external service
  // For now, we'll use environment variables for demo purposes
  
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [
    'demo-api-key-1234567890abcdef',
    'hackathon-api-key-2025',
    'genai-hackathon-demo-key'
  ];

  return validApiKeys.includes(apiKey);
}

/**
 * Extract user ID from API key
 * @param {string} apiKey - API key
 * @returns {string} User ID
 */
function extractUserIdFromApiKey(apiKey) {
  // In production, this would decode the API key to extract user information
  // For demo purposes, we'll use a simple hash
  return `user_${apiKey.substring(0, 8)}`;
}

/**
 * Get user permissions from API key
 * @param {string} apiKey - API key
 * @returns {Array} Array of permissions
 */
function getUserPermissions(apiKey) {
  // In production, this would be fetched from a database
  // For demo purposes, return basic permissions
  return [
    'images:generate',
    'images:list',
    'images:view',
    'moderation:check'
  ];
}

/**
 * Role-based access control middleware
 * @param {Array} requiredPermissions - Required permissions
 * @returns {Function} Middleware function
 */
export const requirePermissions = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.permissions) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'User permissions not found'
        });
      }

      const hasAllPermissions = requiredPermissions.every(permission =>
        req.user.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: `Required permissions: ${requiredPermissions.join(', ')}`,
          userPermissions: req.user.permissions
        });
      }

      next();

    } catch (error) {
      console.error('❌ Permission check error:', error);
      res.status(500).json({
        error: 'Permission check failed',
        message: 'An error occurred during permission validation'
      });
    }
  };
};

/**
 * Rate limiting middleware for specific users
 * @param {Object} options - Rate limiting options
 * @returns {Function} Middleware function
 */
export const userRateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each user to 100 requests per windowMs
    message = 'Too many requests from this user'
  } = options;

  const userRequests = new Map();

  return (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return next();
      }

      const userId = req.user.id;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Get user's request history
      let userHistory = userRequests.get(userId) || [];
      
      // Remove old requests outside the window
      userHistory = userHistory.filter(timestamp => timestamp > windowStart);

      // Check if user has exceeded the limit
      if (userHistory.length >= max) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      // Add current request
      userHistory.push(now);
      userRequests.set(userId, userHistory);

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': max - userHistory.length,
        'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
      });

      next();

    } catch (error) {
      console.error('❌ Rate limiting error:', error);
      next();
    }
  };
};

/**
 * Admin-only middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid API key'
      });
    }

    // Check if user has admin permissions
    const adminPermissions = [
      'admin:all',
      'moderation:update',
      'system:manage'
    ];

    const hasAdminPermission = adminPermissions.some(permission =>
      req.user.permissions.includes(permission)
    );

    if (!hasAdminPermission) {
      return res.status(403).json({
        error: 'Admin access required',
        message: 'This endpoint requires administrative privileges'
      });
    }

    next();

  } catch (error) {
    console.error('❌ Admin check error:', error);
    res.status(500).json({
      error: 'Admin check failed',
      message: 'An error occurred during admin validation'
    });
  }
};