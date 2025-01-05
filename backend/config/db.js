// Import required modules
const mongoose = require('mongoose');

// MongoDB connection URI (replace with your actual URI or use environment variables)
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airpower';

// Options for the Mongoose connection
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Optional: Additional connection options for better error handling and functionality
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect to the server
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  autoIndex: true, // Automatically build indexes (set false in production for performance)
};

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Establishing connection
    await mongoose.connect(DB_URI, options);
    console.log(`MongoDB connected successfully to ${DB_URI}`);
  } catch (err) {
    // Enhanced error handling
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }

  // Additional event listeners for monitoring
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
  });

  mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
  });

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed on application termination');
    process.exit(0);
  });
};

// Export the connection function
module.exports = connectDB;
