const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', roleMiddleware(['ADMIN']), categoryController.createCategory);
router.put('/:id', roleMiddleware(['ADMIN']), categoryController.updateCategory);
router.delete('/:id', roleMiddleware(['ADMIN']), categoryController.deleteCategory);

module.exports = router;
