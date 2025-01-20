const mongoose = require('mongoose');

const PowerDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  powerUsage: {
    type: Number,
    required: [true, 'Power usage is required'],
    min: [0, 'Power usage cannot be negative'],
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  deviceId: {
    type: String,
    required: [true, 'Device ID is required'],
    trim: true,
  },
  isAnomaly: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updatedAt' field before saving
PowerDataSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find power data by location
PowerDataSchema.statics.findByLocation = function (userId, location) {
  return this.find({ userId, location });
};

// Static method to find anomalous power data
PowerDataSchema.statics.findAnomalies = function (userId) {
  return this.find({ userId, isAnomaly: true });
};

// Instance method to mark power data as anomalous
PowerDataSchema.methods.markAsAnomaly = function () {
  this.isAnomaly = true;
  return this.save();
};

const PowerData = mongoose.model('PowerData', PowerDataSchema);

module.exports = PowerData;
