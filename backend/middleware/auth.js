const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { User } = require('../models');
const { redisClient } = require('../config/redis'); // Import Redis client

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Missing or invalid authorization header.' });
    }

    const token = authHeader.split(' ')[1];

    // Check token in Redis cache first
    const cachedUser = await redisClient.get(`user:${token}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid user. User not found.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account inactive. Please contact support.' });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Store user in Redis cache for faster subsequent requests
    await redisClient.set(`user:${token}`, JSON.stringify(req.user), 'EX', 3600); // Cache for 1 hour

    next();
  } catch (error) {
    console.error('Token verification error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Malformed or tampered token.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    return res.status(500).json({ message: 'Internal server error during token verification.' });
  }
};


const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

const logUserActivity = async (req, res, next) => {
  try {
    if (req.user) {
      console.log(`User ${req.user.id} accessed ${req.method} ${req.originalUrl}`);
      // Store activity in a database or log file for auditing
      // Example: await ActivityLog.create({ userId: req.user.id, action: `${req.method} ${req.originalUrl}` });
    }
    next();
  } catch (error) {
    console.error('Error logging user activity:', error);
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  logUserActivity,
};
