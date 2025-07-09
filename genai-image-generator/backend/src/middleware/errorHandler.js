/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('❌ Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    }
  });

  // Determine error type and status code
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorDetails = null;

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation Error';
    errorDetails = err.details || err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = 'Resource Not Found';
  } else if (err.name === 'RateLimitError') {
    statusCode = 429;
    errorMessage = 'Too Many Requests';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorMessage = 'Service Unavailable';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    errorMessage = 'Service Unavailable';
  } else if (err.message && err.message.includes('AWS')) {
    statusCode = 503;
    errorMessage = 'AWS Service Error';
    errorDetails = err.message;
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    errorDetails = null;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ...(errorDetails && { details: errorDetails })
    }
  });
};

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error classes
 */
export class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class AWSServiceError extends Error {
  constructor(message, service = 'AWS') {
    super(`${service} service error: ${message}`);
    this.name = 'AWSServiceError';
    this.service = service;
  }
}