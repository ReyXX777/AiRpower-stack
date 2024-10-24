const { Budget } = require('../models');
const { createError } = require('../utils/error');

class BudgetController {
  static async createBudget(req, res, next) {
    try {
      const { name, description, amount, userId } = req.body;

      const budget = await Budget.create({
        name,
        description,
        amount,
        userId,
      });

      res.status(201).json({ message: 'Budget created successfully', budget });
    } catch (error) {
      next(createError(400, error.message));
    }
  }

  static async getBudgets(req, res, next) {
    try {
      const { userId } = req.user;
      const budgets = await Budget.find({ userId });

      res.status(200).json({ budgets });
    } catch (error) {
      next(createError(500, 'Error fetching budgets'));
    }
  }

  static async getBudgetById(req, res, next) {
    try {
      const { budgetId } = req.params;
      const { userId } = req.user;

      const budget = await Budget.findOne({ _id: budgetId, userId });

      if (!budget) {
        return next(createError(404, 'Budget not found'));
      }

      res.status(200).json({ budget });
    } catch (error) {
      next(createError(500, 'Error fetching budget'));
    }
  }

  static async updateBudget(req, res, next) {
    try {
      const { budgetId } = req.params;
      const { userId } = req.user;
      const { name, description, amount } = req.body;

      const updatedBudget = await Budget.findOneAndUpdate(
        { _id: budgetId, userId },
        { name, description, amount },
        { new: true }
      );

      if (!updatedBudget) {
        return next(createError(404, 'Budget not found'));
      }

      res.status(200).json({ message: 'Budget updated successfully', budget: updatedBudget });
    } catch (error) {
      next(createError(500, 'Error updating budget'));
    }
  }

  static async deleteBudget(req, res, next) {
    try {
      const { budgetId } = req.params;
      const { userId } = req.user;

      const deletedBudget = await Budget.findOneAndDelete({ _id: budgetId, userId });

      if (!deletedBudget) {
        return next(createError(404, 'Budget not found'));
      }

      res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
      next(createError(500, 'Error deleting budget'));
    }
  }
}

module.exports = BudgetController;
