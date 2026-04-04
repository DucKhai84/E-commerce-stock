const paymentService = require('../services/paymentService');

const getPaymentByOrderId = async (req, res) => {
  try {
    const payment = await paymentService.getPaymentByOrderId(req.params.orderId, req.user);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });
    res.status(200).json(payment);
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await paymentService.updatePaymentStatus(req.params.orderId, req.body.status, req.user);
    res.status(200).json(payment);
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  getPaymentByOrderId,
  updatePaymentStatus
};
