import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized to access this route. Please login.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Your account has been deactivated' 
      });
    }

    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired. Please login again.' 
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please login again.' 
      });
    }

    return res.status(401).json({ 
      success: false,
      message: 'Not authorized to access this route' 
    });
  }
};

// Check if user has specific plan
export const requirePlan = (...plans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this feature'
      });
    }

    if (!plans.includes(req.user.plan)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${plans.join(' or ')} plan. Please upgrade your subscription.`,
        requiredPlans: plans,
        currentPlan: req.user.plan
      });
    }

    next();
  };
};

// Check if user has premium plan (pro or elite)
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this feature'
    });
  }

  if (!['pro', 'elite'].includes(req.user.plan)) {
    return res.status(403).json({
      success: false,
      message: 'This feature is only available for Premium subscribers',
      currentPlan: req.user.plan
    });
  }

  next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch (error) {
    // Silently fail - user will be treated as guest
    console.log('Optional auth failed:', error.message);
  }

  next();
};

// Admin check (for future admin features)
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access this feature'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }

  next();
};
