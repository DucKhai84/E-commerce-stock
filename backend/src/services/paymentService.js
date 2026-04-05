const prisma = require('../config/prisma');
const crypto = require('crypto');
const orderService = require('./orderService');

// VNPAY Configuration
const VNP_TMN_CODE = process.env.VNP_TMN_CODE;
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_RETURN_URL = process.env.VNP_RETURN_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

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

const createVnpayUrl = async (orderId, ipAddr) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) throw new Error('Order not found');
  if (order.status !== 'PENDING') throw new Error('Chỉ có thể thanh toán đơn hàng đang chờ (PENDING)');

  const date = new Date();
  const createDate = formatDate(date);

  const tmnCode = VNP_TMN_CODE;
  const secretKey = VNP_HASH_SECRET;
  let vnpUrl = VNP_URL;
  const returnUrl = VNP_RETURN_URL;

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = order.id;
  vnp_Params['vnp_OrderInfo'] = `Thanh toán đơn hàng: ${order.id}`;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = order.totalAmount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  // Sort objects by key alphabetically
  vnp_Params = sortObject(vnp_Params);

  const signData = new URLSearchParams(vnp_Params).toString().replace(/\+/g, "%20");
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;

  const finalUrl = vnpUrl + '?' + new URLSearchParams(vnp_Params).toString();

  console.log(`[PaymentService] Generated VNPAY URL for Order: ${orderId}`);
  return finalUrl;
};

const vnpayReturn = async (vnp_Params) => {
  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = sortObject(vnp_Params);
  const secretKey = VNP_HASH_SECRET;

  const signData = new URLSearchParams(sortedParams).toString().replace(/\+/g, "%20");
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  const orderId = vnp_Params['vnp_TxnRef'];

  if (secureHash === signed) {
    const responseCode = vnp_Params['vnp_ResponseCode'];

    if (responseCode === "00") {
      // Payment SUCCESS
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        }),
        prisma.payment.update({
          where: { orderId: orderId },
          data: { status: 'COMPLETED' }
        })
      ]);
      return `${FRONTEND_URL}/payment-success?orderId=${orderId}`;
    } else {
      // Payment FAILED
      await orderService.failOrder(orderId);
      await prisma.payment.update({
        where: { orderId: orderId },
        data: { status: 'FAILED' }
      });
      return `${FRONTEND_URL}/payment-failed?orderId=${orderId}`;
    }
  } else {
    // Checksum failed
    console.error(`[PaymentService] Checksum failed for Order: ${orderId}`);
    return `${FRONTEND_URL}/payment-failed?orderId=${orderId}&error=checksum_failed`;
  }
};

// Utils
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[decodeURIComponent(str[key])] = obj[decodeURIComponent(str[key])];
  }
  return sorted;
}

function formatDate(date) {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const sec = date.getSeconds().toString().padStart(2, '0');
  return yyyy + mm + dd + hh + min + sec;
}

module.exports = {
  getPaymentByOrderId,
  updatePaymentStatus,
  createVnpayUrl,
  vnpayReturn
};
