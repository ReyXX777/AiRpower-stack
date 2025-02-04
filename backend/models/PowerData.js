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
  unit: { // Added unit field (e.g., kWh, Watts)
    type: String,
    required: true,
    enum: ['kWh', 'Watts', 'Amps'], // Example units
    default: 'kWh'
  },
  cost: { // Added cost field (calculated or stored)
      type: Number,
      required: false // Cost might be derived
  }
});

PowerDataSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

PowerDataSchema.statics.findByLocation = function (userId, location) {
  return this.find({ userId, location });
};

PowerDataSchema.statics.findAnomalies = function (userId) {
  return this.find({ userId, isAnomaly: true });
};

PowerDataSchema.methods.markAsAnomaly = function () {
  this.isAnomaly = true;
  return this.save();
};

// Virtual for calculating cost based on usage and a hypothetical rate (you might fetch this from a config or DB)
PowerDataSchema.virtual('estimatedCost').get(function() {
    const ratePerKwh = 0.15; // Example rate, replace with your actual rate
    if (this.unit === 'kWh') {
        return this.powerUsage * ratePerKwh;
    } else if (this.unit === 'Watts') {
        return (this.powerUsage / 1000) * ratePerKwh; // Convert watts to kWh
    } else {
        return null; // Handle other units as needed or return null
    }
});


const PowerData = mongoose.model('PowerData', PowerDataSchema);

module.exports = PowerData;

