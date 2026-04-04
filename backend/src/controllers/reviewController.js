const reviewService = require('../services/reviewService');

const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(req.user.userId, req.params.productId, req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  deleteReview
};
