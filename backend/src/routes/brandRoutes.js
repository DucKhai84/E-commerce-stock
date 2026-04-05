const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Admin only routes
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), brandController.createBrand);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), brandController.updateBrand);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), brandController.deleteBrand);

module.exports = router;
