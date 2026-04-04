const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/:orderId', paymentController.getPaymentByOrderId);
router.put('/:orderId/status', paymentController.updatePaymentStatus);

module.exports = router;
