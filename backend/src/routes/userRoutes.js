const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', roleMiddleware(['ADMIN']), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
