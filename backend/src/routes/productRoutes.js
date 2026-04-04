const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), productController.deleteProduct);

module.exports = router;
