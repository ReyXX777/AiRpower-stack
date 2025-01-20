const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
});

// Middleware to update the 'updatedAt' field before saving
BudgetSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find budgets by category
BudgetSchema.statics.findByCategory = function (userId, category) {
  return this.find({ userId, category, isArchived: false });
};

// Instance method to archive a budget
BudgetSchema.methods.archive = function () {
  this.isArchived = true;
  return this.save();
};

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
