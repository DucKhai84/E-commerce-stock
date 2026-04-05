const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), paymentController.getAllPayments);
router.post('/create', authMiddleware, paymentController.createVnpayUrl);
router.get('/vnpay-return', paymentController.vnpayReturn); // Public callback
router.get('/:orderId', authMiddleware, paymentController.getPaymentByOrderId);
router.patch('/:orderId/status', authMiddleware, paymentController.updatePaymentStatus);
router.delete('/:orderId', authMiddleware, roleMiddleware(['ADMIN']), paymentController.deletePayment);

module.exports = router;
