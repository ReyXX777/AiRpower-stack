
const { Budget } = require('../models');
const { createError } = require('../utils/error');

class BudgetController {
  /**
   * Create a new budget
   */
  static async createBudget(req, res, next) {
    try {
      const { name, description, amount, userId, category } = req.body;

      // Validate input
      if (!name || typeof amount !== 'number' || !userId || !category) {
        return next(createError(400, 'Name, valid amount, userId, and category are required'));
      }

      const budget = await Budget.create({ name, description, amount, userId, category });
      res.status(201).json({ message: 'Budget created successfully', budget });
    } catch (error) {
      next(createError(400, error.message));
    }
  }

  /**
   * Get all budgets for the logged-in user
   */
  static async getBudgets(req, res, next) {
    try {
      const { userId } = req.user;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const budgets = await Budget.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ budgets });
    } catch (error) {
      next(createError(500, 'Error fetching budgets'));
    }
  }

  /**
   * Get a single budget by ID
   */
  static async getBudgetById(req, res, next) {
    try {
      const { budgetId } = req.params;
      const { userId } = req.user;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const budget = await Budget.findOne({ _id: budgetId, userId });

      if (!budget) {
        return next(createError(404, 'Budget not found'));
      }

      res.status(200).json({ budget });
    } catch (error) {
      next(createError(500, error.message || 'Error fetching budget'));
    }
  }

  /**
   * Update a budget by ID
   */
  static async updateBudget(req, res, next) {
    try {
      const { budgetId } = req.params;
      const { userId } = req.user;
      const { name, description, amount, category } = req.body;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const updatedBudget = await Budget.findOneAndUpdate(
        { _id: budgetId, userId },
        { name, description, amount, category },
        { new: true, runValidators: true }
      );

      if (!updatedBudget) {
        return next(createError(404, 'Budget not found'));
      }

      res.status(200).json({ message: 'Budget updated successfully', budget: updatedBudget });
    } catch (error) {
      next(createError(500, error.message || 'Error updating budget'));
    }
  }

  /**
   * Delete a budget by ID
   */
  static async deleteBudget(req, res, next) {
    try {
      const { budgetId } = req.params;
      const { userId } = req.user;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const deletedBudget = await Budget.findOneAndDelete({ _id: budgetId, userId });

      if (!deletedBudget) {
        return next(createError(404, 'Budget not found'));
      }

      // Send notification to user
      await this.sendNotification(userId, `Budget with ID ${budgetId} has been deleted.`);

      res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
      next(createError(500, error.message || 'Error deleting budget'));
    }
  }

  /**
   * Send notification to user
   */
  static async sendNotification(userId, message) {
    // Simulate sending a notification (e.g., email, SMS, etc.)
    console.log(`Notification sent to user ${userId}: ${message}`);
  }

  /**
   * Get budgets by category
   */
  static async getBudgetsByCategory(req, res, next) {
    try {
      const { userId } = req.user;
      const { category } = req.params;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const budgets = await Budget.find({ userId, category }).sort({ createdAt: -1 });

      if (!budgets || budgets.length === 0) {
        return next(createError(404, 'No budgets found for this category'));
      }

      res.status(200).json({ budgets });
    } catch (error) {
      next(createError(500, error.message || 'Error fetching budgets by category'));
    }
  }
}

module.exports = BudgetController;
