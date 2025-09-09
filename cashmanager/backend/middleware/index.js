const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { User } = require('../db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('No authorization header present');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid authorization header format');
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format'
      });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded:', decoded);
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('User not found for ID:', decoded.userId);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.userId = decoded.userId;
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(error);
  }
};

const errorHandler = (err, req, res, next) => {
  console.error('Error handler caught:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate key error'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

module.exports = {
  authMiddleware,
  errorHandler
}; 