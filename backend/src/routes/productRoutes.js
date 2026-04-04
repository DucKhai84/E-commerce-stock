const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', roleMiddleware(['ADMIN']), productController.createProduct);
router.put('/:id', roleMiddleware(['ADMIN']), productController.updateProduct);
router.delete('/:id', roleMiddleware(['ADMIN']), productController.deleteProduct);

module.exports = router;
