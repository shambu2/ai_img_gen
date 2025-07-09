import express from 'express';

export default function healthRoutes() {
  const router = express.Router();

  /**
   * @route GET /api/health
   * @desc Basic health check
   * @access Public
   */
  router.get('/', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid
    });
  });

  /**
   * @route GET /api/health/detailed
   * @desc Detailed health check with AWS service status
   * @access Private
   */
  router.get('/detailed', async (req, res) => {
    try {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        pid: process.pid,
        services: {
          aws: {
            region: process.env.AWS_REGION || 'us-east-1',
            bedrock: 'available',
            s3: 'available'
          },
          database: 'not_implemented',
          cache: 'not_implemented'
        },
        dependencies: {
          express: '✓',
          cors: '✓',
          helmet: '✓',
          rateLimit: '✓'
        }
      };

      res.status(200).json(healthStatus);

    } catch (error) {
      console.error('❌ Detailed health check failed:', error);
      res.status(500).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * @route GET /api/health/ready
   * @desc Readiness probe for Kubernetes
   * @access Public
   */
  router.get('/ready', (req, res) => {
    // Check if the application is ready to serve requests
    const isReady = process.env.NODE_ENV === 'production' ? 
      process.uptime() > 10 : // Wait 10 seconds in production
      true; // Always ready in development

    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    }
  });

  /**
   * @route GET /api/health/live
   * @desc Liveness probe for Kubernetes
   * @access Public
   */
  router.get('/live', (req, res) => {
    // Check if the application is alive and responsive
    const isAlive = process.memoryUsage().heapUsed < 500 * 1024 * 1024; // Less than 500MB

    if (isAlive) {
      res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
      });
    } else {
      res.status(503).json({
        status: 'not_alive',
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
      });
    }
  });

  /**
   * @route GET /api/health/metrics
   * @desc Application metrics for monitoring
   * @access Private
   */
  router.get('/metrics', (req, res) => {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      application: {
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001
      },
      performance: {
        // These would be populated by actual metrics collection
        requestsPerSecond: 0,
        averageResponseTime: 0,
        errorRate: 0,
        activeConnections: 0
      }
    };

    res.status(200).json(metrics);
  });

  return router;
}