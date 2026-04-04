const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable access to productId from parent router
const reviewController = require('../controllers/reviewController');

router.get('/', reviewController.getProductReviews);
router.post('/', reviewController.addReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
