const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), productController.deleteProduct);

module.exports = router;
