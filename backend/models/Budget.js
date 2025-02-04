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
  dueDate: { // Added dueDate field
    type: Date,
    required: false, // Not strictly required, can be null
  },
  recurring: { // Added recurring field
    type: Boolean,
    default: false,
  },
});

BudgetSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

BudgetSchema.statics.findByCategory = function (userId, category) {
  return this.find({ userId, category, isArchived: false });
};

BudgetSchema.methods.archive = function () {
  this.isArchived = true;
  return this.save();
};

// Virtual to calculate remaining budget if dueDate is in the future
BudgetSchema.virtual('remainingBudget').get(function() {
    if (this.dueDate && this.dueDate > Date.now() && !this.isArchived) {
        const timeDiff = this.dueDate.getTime() - Date.now();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // Example: Distribute the budget evenly over the remaining days
        return this.amount / daysLeft; 
    }
    return this.amount; // If no due date or past due date or archived, return the original amount.
});

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;

