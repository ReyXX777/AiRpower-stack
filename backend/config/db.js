// Import required modules
const mongoose = require('mongoose');
const express = require('express'); // Added Express for creating a server
const cors = require('cors'); // Added CORS for handling cross-origin requests

// MongoDB connection URI (replace with your actual URI or use environment variables)
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airpower';

// Options for the Mongoose connection
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  autoIndex: true,
};

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, options);
    console.log(`MongoDB connected successfully to ${DB_URI}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
  });

  mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed on application termination');
    process.exit(0);
  });
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the AirPower API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the connection function and app
module.exports = { connectDB, app };
