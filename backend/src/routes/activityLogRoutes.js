const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All activity-log routes for admin only
router.use(authMiddleware, roleMiddleware(['ADMIN']));

router.get('/', activityLogController.getAllLogs);
router.get('/:id', activityLogController.getLogById);

module.exports = router;
