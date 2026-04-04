const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', roleMiddleware(['ADMIN']), inventoryController.getAllInventories);
router.get('/:id', roleMiddleware(['ADMIN']), inventoryController.getInventoryById);
router.post('/', roleMiddleware(['ADMIN']), inventoryController.createInventory);
router.put('/:id', roleMiddleware(['ADMIN']), inventoryController.updateInventory);
router.delete('/:id', roleMiddleware(['ADMIN']), inventoryController.deleteInventory);

module.exports = router;
