const { Data } = require('../models');
const { createError } = require('../utils/error');

class DataController {
  static async createData(req, res, next) {
    try {
      const { userId } = req.user;
      const { name, description, data } = req.body;

      const newdata = await Data.create({
        name,
        description,
        data,
        userId,
      });

      res.status(201).json({ message: 'Data created successfully', data: newdata });
    } catch (error) {
      next(createError(400, error.message));
    }
  }

  static async getData(req, res, next) {
    try {
      const { userId } = req.user;
      const data = await Data.find({ userId });

      res.status(200).json({ data });
    } catch (error) {
      next(createError(500, 'Error fetching data'));
    }
  }

  static async getDataById(req, res, next) {
    try {
      const { dataId } = req.params;
      const { userId } = req.user;

      const data = await Data.findOne({ _id: dataId, userId });

      if (!data) {
        return next(createError(404, 'Data not found'));
      }

      res.status(200).json({ data });
    } catch (error) {
      next(createError(500, 'Error fetching data'));
    }
  }

  static async updateData(req, res, next) {
    try {
      const { dataId } = req.params;
      const { userId } = req.user;
      const { name, description, data } = req.body;

      const updatedData = await Data.findOneAndUpdate(
        { _id: dataId, userId },
        { name, description, data },
        { new: true }
      );

      if (!updatedData) {
        return next(createError(404, 'Data not found'));
      }

      res.status(200).json({ message: 'Data updated successfully', data: updatedData });
    } catch (error) {
      next(createError(500, 'Error updating data'));
    }
  }

  static async deleteData(req, res, next) {
    try {
      const { dataId } = req.params;
      const { userId } = req.user;

      const deletedData = await Data.findOneAndDelete({ _id: dataId, userId });

      if (!deletedData) {
        return next(createError(404, 'Data not found'));
      }

      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
      next(createError(500, 'Error deleting data'));
    }
  }
}

module.exports = DataController;
