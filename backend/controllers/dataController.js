const { Data } = require('../models');
const { createError } = require('../utils/error');

class DataController {
  /**
   * Create a new data entry
   */
  static async createData(req, res, next) {
    try {
      const { userId } = req.user;
      const { name, description, data } = req.body;

      // Validate input
      if (!name || !data) {
        return next(createError(400, 'Name and data fields are required'));
      }

      const newData = await Data.create({
        name,
        description,
        data,
        userId,
      });

      res.status(201).json({ message: 'Data created successfully', data: newData });
    } catch (error) {
      next(createError(500, error.message || 'Error creating data entry'));
    }
  }

  /**
   * Get all data entries for the logged-in user
   */
  static async getData(req, res, next) {
    try {
      const { userId } = req.user;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const data = await Data.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json({ data });
    } catch (error) {
      next(createError(500, error.message || 'Error fetching data entries'));
    }
  }

  /**
   * Get a single data entry by ID
   */
  static async getDataById(req, res, next) {
    try {
      const { dataId } = req.params;
      const { userId } = req.user;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const dataEntry = await Data.findOne({ _id: dataId, userId });

      if (!dataEntry) {
        return next(createError(404, 'Data entry not found'));
      }

      res.status(200).json({ data: dataEntry });
    } catch (error) {
      next(createError(500, error.message || 'Error fetching data entry'));
    }
  }

  /**
   * Update a data entry by ID
   */
  static async updateData(req, res, next) {
    try {
      const { dataId } = req.params;
      const { userId } = req.user;
      const { name, description, data } = req.body;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const updatedData = await Data.findOneAndUpdate(
        { _id: dataId, userId },
        { name, description, data },
        { new: true, runValidators: true }
      );

      if (!updatedData) {
        return next(createError(404, 'Data entry not found'));
      }

      res.status(200).json({ message: 'Data updated successfully', data: updatedData });
    } catch (error) {
      next(createError(500, error.message || 'Error updating data entry'));
    }
  }

  /**
   * Delete a data entry by ID
   */
  static async deleteData(req, res, next) {
    try {
      const { dataId } = req.params;
      const { userId } = req.user;

      if (!userId) {
        return next(createError(401, 'Unauthorized'));
      }

      const deletedData = await Data.findOneAndDelete({ _id: dataId, userId });

      if (!deletedData) {
        return next(createError(404, 'Data entry not found'));
      }

      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
      next(createError(500, error.message || 'Error deleting data entry'));
    }
  }
}

module.exports = DataController;
