const express = require('express');
const router = express.Router({ mergeParams: true });
const productImageController = require('../controllers/productImageController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Routes mounted at /api/v1/products/:productId/images in app.js
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), productImageController.addImage);
router.get('/', productImageController.getImages);

// Global image management
router.put('/images/:id', authMiddleware, roleMiddleware(['ADMIN']), productImageController.updateImage);
router.delete('/images/:id', authMiddleware, roleMiddleware(['ADMIN']), productImageController.deleteImage);

module.exports = router;
