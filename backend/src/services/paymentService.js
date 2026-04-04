const prisma = require('../config/prisma');

const getPaymentByOrderId = async (orderId, requestingUser) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: { order: true }
  });

  if (!payment) return null;

  // Ownership check
  if (payment.order.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
    throw new Error('Access denied');
  }

  return payment;
};

const updatePaymentStatus = async (orderId, status, requestingUser) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: { order: true }
  });

  if (!payment) throw new Error('Payment record not found');

  // Only ADMIN can mark payments as COMPLETED or REFUNDED manually in this simple version
  if (requestingUser.role !== 'ADMIN') {
    throw new Error('Access denied: Only admins can manually update payment status');
  }

  return await prisma.payment.update({
    where: { orderId },
    data: { status }
  });
};

module.exports = {
  getPaymentByOrderId,
  updatePaymentStatus
};
