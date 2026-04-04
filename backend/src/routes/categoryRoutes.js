const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), categoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), categoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), categoryController.deleteCategory);

module.exports = router;
