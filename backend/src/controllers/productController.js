const productService = require('../services/productService');
const activityLogService = require('../services/activityLogService');

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log('[ProductController] Body nhận được:', req.body);
    console.log('[ProductController] File nhận được:', req.file ? req.file.filename : 'Không có');

    const productData = req.body || {};

    if (req.file) {
      productData.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const product = await productService.createProduct(productData);

    // Auto-log product creation
    await activityLogService.createLog({
      userId: req.user.userId,
      action: 'CREATE_PRODUCT',
      details: `Created product: ${product.name} (ID: ${product.id})`
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('[ProductController Error]', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    console.log(`[ProductController] Đang cập nhật SP ID: ${req.params.id}`);
    console.log('[ProductController] Body nhận được:', req.body);

    const productData = req.body || {};

    if (req.file) {
      productData.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    console.log('[ProductController] Final Product Data to Service:', productData);
    const product = await productService.updateProduct(req.params.id, productData);

    // Auto-log product update
    await activityLogService.createLog({
      userId: req.user.userId,
      action: 'UPDATE_PRODUCT',
      details: `Updated product ID: ${req.params.id}`
    });

    res.status(200).json(product);
  } catch (error) {
    console.error('[ProductController Update Error]', error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);

    // Auto-log product deletion
    await activityLogService.createLog({
      userId: req.user.userId,
      action: 'DELETE_PRODUCT',
      details: `Deleted product ID: ${req.params.id}`
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
