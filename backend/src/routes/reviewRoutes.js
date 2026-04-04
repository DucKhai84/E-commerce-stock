const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable access to productId from parent router
const reviewController = require('../controllers/reviewController');

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', reviewController.getProductReviews);
router.post('/', authMiddleware, reviewController.addReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
