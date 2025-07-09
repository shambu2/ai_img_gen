/**
 * Request logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = generateRequestId();

  // Add request ID to request object
  req.requestId = requestId;

  // Log incoming request
  console.log(`📥 [${requestId}] ${req.method} ${req.originalUrl}`, {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    body: req.method !== 'GET' && req.body ? 'present' : undefined
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log response
    const logLevel = res.statusCode >= 400 ? '❌' : '📤';
    console.log(`${logLevel} [${requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`, {
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length'),
      contentType: res.get('Content-Type')
    });

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Generate unique request ID
 * @returns {string} Request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Detailed request logger for development
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const detailedRequestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Detailed Request:', {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * Performance monitoring middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const performanceMonitor = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

    // Log slow requests
    if (duration > 1000) { // More than 1 second
      console.warn(`🐌 Slow request detected: ${req.method} ${req.originalUrl} took ${duration.toFixed(2)}ms`);
    }

    // Log performance metrics
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Performance: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    }
  });

  next();
};

/**
 * Security logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const securityLogger = (req, res, next) => {
  // Log potential security issues
  const suspiciousPatterns = [
    /script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  const userAgent = req.get('User-Agent') || '';
  const url = req.originalUrl;
  const body = JSON.stringify(req.body);

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(userAgent) || pattern.test(url) || pattern.test(body)
  );

  if (isSuspicious) {
    console.warn(`🚨 Suspicious request detected:`, {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent,
      body: body.length > 1000 ? body.substring(0, 1000) + '...' : body
    });
  }

  next();
};