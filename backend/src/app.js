const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productImageRoutes = require('./routes/productImageRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');
const authMiddleware = require('./middlewares/auth.middleware');
const path = require('path');

const app = express();

// Enable CORS for all routes (to fix development origin issues)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/products', productRoutes); // Public browsing
app.use('/api/v1/products/:productId/reviews', reviewRoutes); // Partially public
app.use('/api/v1/categories', categoryRoutes); // Public browsing
app.use('/api/v1/orders', authMiddleware, orderRoutes);
app.use('/api/v1/inventory', authMiddleware, inventoryRoutes);
app.use('/api/v1/messages', authMiddleware, messageRoutes);
app.use('/api/v1/cart', authMiddleware, cartRoutes);
app.use('/api/v1/addresses', authMiddleware, addressRoutes);
app.use('/api/v1/payments', paymentRoutes); // Authentication handled per-route in paymentRoutes.js
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/products/:productId/images', productImageRoutes);
app.use('/api/v1/wishlist', authMiddleware, wishlistRoutes);
app.use('/api/v1/activity-logs', authMiddleware, activityLogRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API v1 with Prisma and MongoDB is running!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
