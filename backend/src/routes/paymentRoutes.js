const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create', authMiddleware, paymentController.createVnpayUrl);
router.get('/vnpay-return', paymentController.vnpayReturn); // Public callback
router.get('/:orderId', authMiddleware, paymentController.getPaymentByOrderId);
router.patch('/:orderId/status', authMiddleware, paymentController.updatePaymentStatus);

module.exports = router;
