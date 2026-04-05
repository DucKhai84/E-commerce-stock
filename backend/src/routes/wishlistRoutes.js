const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/auth.middleware');

// All wishlist routes require authentication
router.use(authMiddleware);

router.post('/', wishlistController.addToWishlist);
router.get('/', wishlistController.getWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
