const { Data, Recommendation } = require('../models');
const { createError } = require('../utils/error');
const generateRecommendations = require('../utils/recommendationHelper');

class RecommendationController {
  /**
   * Generate recommendations based on user data
   */
  static async getRecommendations(req, res, next) {
    try {
      const { userId } = req.user;

      // Fetch the user's power consumption data
      const data = await Data.find({ userId });

      if (!data || data.length === 0) {
        return next(createError(404, 'No data found for recommendations'));
      }

      // Process the data to generate personalized recommendations
      const recommendations = generateRecommendations(data);

      res.status(200).json({
        message: 'Recommendations generated successfully',
        recommendations,
      });
    } catch (error) {
      next(createError(500, 'Error generating recommendations'));
    }
  }

  /**
   * Save user-specific recommendations for future reference
   */
  static async saveRecommendation(req, res, next) {
    try {
      const { userId } = req.user;
      const { title, details } = req.body;

      // Validate input
      if (!title || !details) {
        return next(createError(400, 'Title and details are required'));
      }

      const newRecommendation = await Recommendation.create({
        userId,
        title,
        details,
      });

      res.status(201).json({
        message: 'Recommendation saved successfully',
        recommendation: newRecommendation,
      });
    } catch (error) {
      next(createError(500, 'Error saving recommendation'));
    }
  }

  /**
   * Retrieve saved recommendations for the user
   */
  static async getSavedRecommendations(req, res, next) {
    try {
      const { userId } = req.user;

      const savedRecommendations = await Recommendation.find({ userId });

      if (!savedRecommendations || savedRecommendations.length === 0) {
        return next(createError(404, 'No saved recommendations found'));
      }

      res.status(200).json({ recommendations: savedRecommendations });
    } catch (error) {
      next(createError(500, 'Error fetching saved recommendations'));
    }
  }

  /**
   * Delete a saved recommendation
   */
  static async deleteRecommendation(req, res, next) {
    try {
      const { recommendationId } = req.params;
      const { userId } = req.user;

      const deletedRecommendation = await Recommendation.findOneAndDelete({
        _id: recommendationId,
        userId,
      });

      if (!deletedRecommendation) {
        return next(createError(404, 'Recommendation not found'));
      }

      res.status(200).json({
        message: 'Recommendation deleted successfully',
      });
    } catch (error) {
      next(createError(500, 'Error deleting recommendation'));
    }
  }
}

module.exports = RecommendationController;
