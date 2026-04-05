const prisma = require('../config/prisma');
const crypto = require('crypto');
const orderService = require('./orderService');

// VNPAY Configuration
// VNPAY Configuration - Sanitized
const VNP_TMN_CODE = (process.env.VNP_TMN_CODE || '').trim().replace(/['"]/g, '');
const VNP_HASH_SECRET = (process.env.VNP_HASH_SECRET || '').trim().replace(/['"]/g, '');
const VNP_URL = (process.env.VNP_URL || '').trim().replace(/['"]/g, '');
const VNP_RETURN_URL = (process.env.VNP_RETURN_URL || '').trim().replace(/['"]/g, '');
const FRONTEND_URL = (process.env.FRONTEND_URL || '').trim().replace(/['"]/g, '');

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

const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      order: {
        include: {
          user: { select: { fullName: true, email: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const deletePayment = async (orderId) => {
  return await prisma.payment.delete({
    where: { orderId }
  });
};

const createVnpayUrl = async (orderId, ipAddr) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) throw new Error('Order not found');

  // Expiration check
  if (order.expiresAt && order.expiresAt < new Date()) {
    await orderService.failOrder(orderId);
    throw new Error('Đơn hàng đã hết hạn thanh toán (10 phút). Vui lòng đặt hàng lại.');
  }

  if (order.status !== 'PENDING' && order.status !== 'RESERVED') {
    throw new Error('Chỉ có thể thanh toán đơn hàng đang chờ hoặc đang giữ chỗ (PENDING/RESERVED)');
  }

  // Update order to RESERVED with new expiration time (10 minutes)
  await orderService.reserveOrderForPayment(orderId);

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
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + order.id;
  vnp_Params['vnp_OrderType'] = 'billpayment';
  vnp_Params['vnp_Amount'] = Math.round(order.totalAmount * 100);
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr.trim();
  vnp_Params['vnp_CreateDate'] = createDate;

  // 2. Sort and build signData (ENCODED for 2.1.0)
  let sortedKeys = Object.keys(vnp_Params).sort();
  let signData = "";

  for (let i = 0; i < sortedKeys.length; i++) {
    let key = sortedKeys[i];
    let val = vnp_Params[key];

    if (val !== undefined && val !== null && val !== "") {
      if (signData.length > 0) signData += "&";
      // Official 2.1.0: Both the hash and the URL use ENCODED values.
      signData += encodeURIComponent(key) + "=" + encodeURIComponent(val).replace(/%20/g, "+");
    }
  }

  // 3. Generate Secure Hash (HMAC SHA512)
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  // 4. Final URL
  const finalUrl = vnpUrl + "?" + signData + "&vnp_SecureHash=" + signed;

  console.log(`[PaymentService] Creation Sign Data (Encoded): ${signData}`);
  console.log(`[PaymentService] Generated VNPAY URL: ${finalUrl}`);

  return finalUrl;
};

const vnpayReturn = async (vnp_Params) => {
  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const secretKey = VNP_HASH_SECRET;
  const orderId = vnp_Params['vnp_TxnRef'];

  // 1. Filter and sort parameters (EXCLUDE ALL NON-vnp_ OR SIGNATURE KEYS)
  const sortedKeys = Object.keys(vnp_Params)
    .filter(key => key.startsWith('vnp_') && key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
    .sort();

  let signData = "";
  for (let i = 0; i < sortedKeys.length; i++) {
    let key = sortedKeys[i];
    let val = vnp_Params[key];
    if (val !== undefined && val !== null && val !== "") {
      if (signData.length > 0) signData += "&";
      // Callbacks ALSO need to be encoded to match the signature
      signData += encodeURIComponent(key) + "=" + encodeURIComponent(val).replace(/%20/g, "+");
    }
  }

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  console.log(`[PaymentService] Callback Sign Data (Encoded): ${signData}`);
  console.log(`[PaymentService] Callback Checksum: ${signed === secureHash ? 'Match' : 'Mismatch'}`);
  console.log(`[PaymentService] Received Hash: ${secureHash}, Calculated Hash: ${signed}`);


  if (secureHash === signed) {
    const responseCode = vnp_Params['vnp_ResponseCode'];
    console.log(`[PaymentService] VNPAY Response Code: ${responseCode} for Order: ${orderId}`);

    if (responseCode === "00") {
      // Payment SUCCESS: High-level finalization includes status + stock
      await orderService.finalizeOrderPayment(orderId);

      // Update payment record separately
      await prisma.payment.update({
        where: { orderId: orderId },
        data: { status: 'COMPLETED' }
      });
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
  vnpayReturn,
  getAllPayments,
  deletePayment
};
