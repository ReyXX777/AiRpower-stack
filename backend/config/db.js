// Import required modules
const mongoose = require('mongoose');

// MongoDB connection URI (replace with your actual URI or use environment variables)
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airpower';

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
