require('dotenv').config();
const app = require('./src/app');
const { seedAdmin } = require('./src/services/seedService');

const PORT = process.env.PORT || 3000;

// Seed Admin on startup
seedAdmin();

// Set up periodic cleanup for expired cart and order reservations (Release stock)
const { releaseExpiredReservations } = require('./src/services/cartService');
const { releaseExpiredOrders } = require('./src/services/orderService');

setInterval(() => {
  releaseExpiredReservations()
    .catch(err => console.error('Lỗi khi dọn dẹp giỏ hàng hết hạn:', err));

  releaseExpiredOrders()
    .catch(err => console.error('Lỗi khi dọn dẹp đơn hàng hết hạn:', err));
}, 60000); // Check every minute

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
