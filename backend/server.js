const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for parsing JSON and enabling CORS
app.use(express.json());
app.use(cors());

// Security middleware
app.use(helmet());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging middleware
app.use(morgan('dev'));

// MongoDB Connection
const db = require('./config/db');
db.connect();

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api', apiRoutes);

// Fallback to index.html for any other route (for SPA frontend)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
