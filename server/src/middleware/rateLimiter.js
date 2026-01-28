import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (optional)
  skipSuccessfulRequests: false,
  // Skip failed requests (optional)
  skipFailedRequests: false,
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for AI predictions (more restrictive for free users)
export const aiPredictionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 predictions per hour
  message: {
    success: false,
    message: 'Prediction limit reached. Upgrade to Premium for unlimited predictions.',
    upgradeUrl: '/subscription'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator based on user ID if authenticated
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  // Skip premium users
  skip: (req) => {
    return req.user && ['pro', 'elite'].includes(req.user.plan);
  }
});

// Rate limiter for chat messages
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute
  message: {
    success: false,
    message: 'You are sending messages too quickly. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  }
});

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per 15 minutes
  message: {
    success: false,
    message: 'Upload limit reached. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  }
});

// Dynamic rate limiter based on user plan
export const dynamicLimiter = (freeLimitMax, proLimitMax, eliteLimitMax) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) => {
      if (!req.user) return freeLimitMax;
      
      switch (req.user.plan) {
        case 'elite':
          return eliteLimitMax;
        case 'pro':
          return proLimitMax;
        default:
          return freeLimitMax;
      }
    },
    message: (req) => ({
      success: false,
      message: 'Rate limit exceeded. Consider upgrading your plan for higher limits.',
      currentPlan: req.user?.plan || 'free'
    }),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user ? req.user.id : req.ip;
    }
  });
};

// Store for tracking request counts (could use Redis in production)
const requestCounts = new Map();

// Custom rate limiter with sliding window
export const slidingWindowLimiter = (windowMs, maxRequests) => {
  return (req, res, next) => {
    const key = req.user ? req.user.id : req.ip;
    const now = Date.now();
    
    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }
    
    const requests = requestCounts.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
      });
    }
    
    validRequests.push(now);
    requestCounts.set(key, validRequests);
    
    next();
  };
};

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const maxAge = 60 * 60 * 1000; // 1 hour
  
  for (const [key, requests] of requestCounts.entries()) {
    const validRequests = requests.filter(timestamp => now - timestamp < maxAge);
    
    if (validRequests.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, validRequests);
    }
  }
}, 5 * 60 * 1000);

export default {
  apiLimiter,
  authLimiter,
  aiPredictionLimiter,
  chatLimiter,
  passwordResetLimiter,
  uploadLimiter,
  dynamicLimiter,
  slidingWindowLimiter
};
