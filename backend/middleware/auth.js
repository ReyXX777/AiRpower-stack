const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch the user from the database using the decoded userId
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid user. User not found.' });
    }

    // Attach the user object to the request for use in subsequent middleware/routes
    req.user = user;

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

module.exports = {
  authenticateToken
};
