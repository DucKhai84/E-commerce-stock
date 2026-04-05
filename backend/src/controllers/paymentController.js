const paymentService = require('../services/paymentService');

const getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByOrderId(req.params.orderId, req.user);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await paymentService.updatePaymentStatus(req.params.orderId, req.body.status, req.user);
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.orderId);
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createVnpayUrl = async (req, res) => {
  try {
    const { orderId } = req.body;
    let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    if (ipAddr === '::1') {
      ipAddr = '127.0.0.1';
    }

    const paymentUrl = await paymentService.createVnpayUrl(orderId, ipAddr);
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('[PaymentController] Error creating VNPAY URL:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const vnpayReturn = async (req, res) => {
  try {
    console.log('[PaymentController] Received VNPAY Callback:', req.query);
    const redirectUrl = await paymentService.vnpayReturn(req.query);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('[PaymentController] VNPAY Callback Error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=system_error`);
  }
};

module.exports = {
  getPaymentByOrderId,
  updatePaymentStatus,
  createVnpayUrl,
  vnpayReturn,
  getAllPayments,
  deletePayment
};
