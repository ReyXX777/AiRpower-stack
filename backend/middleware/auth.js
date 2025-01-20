const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Missing or invalid authorization header.' });
    }

    const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

    // Verify the token and decode its payload
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch the user from the database using the decoded userId
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid user. User not found.' });
    }

    // Check if the user is active (optional, for added security)
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account inactive. Please contact support.' });
    }

    // Attach the user object (excluding sensitive fields) to the request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role, // If roles are implemented
    };

    // Proceed to the next middleware/route
    next();
  } catch (error) {
    console.error('Token verification error:', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Malformed or tampered token.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    // Handle other errors
    return res.status(500).json({ message: 'Internal server error during token verification.' });
  }
};

/**
 * Middleware to check if the user has a specific role
 */
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

/**
 * Middleware to log user activity
 */
const logUserActivity = async (req, res, next) => {
  try {
    if (req.user) {
      console.log(`User ${req.user.id} accessed ${req.method} ${req.originalUrl}`);
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
