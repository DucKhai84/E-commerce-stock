const prisma = require('../config/prisma');

const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true, description: true }
      },
      inventory: true
    }
  });

  // Calculate available stock for each product
  return products.map(product => ({
    ...product,
    stock: product.inventory ? (product.inventory.quantity - product.inventory.reserved) : product.stock
  }));
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { name: true, description: true }
      },
      inventory: true,
      reviews: {
        include: {
          user: { select: { fullName: true } }
        }
      }
    }
  });

  if (product && product.inventory) {
    product.stock = product.inventory.quantity - product.inventory.reserved;
  }

  return product;
};

const createProduct = async (productData = {}) => {
  // Safe destructuring with defaults
  const { name, price, stock, description = '', categoryId, imageUrl } = productData;

  if (!name) {
    throw new Error('Tên sản phẩm không được để trống');
  }

  // Pre-validate numbers
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    throw new Error('Đơn giá sản phẩm (price) không hợp lệ - phải là số lớn hơn 0');
  }

  const numStock = parseInt(stock) || 0;

  console.log(`[ProductService] Đang tạo mới SP: "${name}", Giá: ${numPrice}, Kho: ${numStock}`);

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: String(name),
        price: numPrice,
        stock: numStock,
        description: String(description || ''),
        categoryId: String(categoryId),
        imageUrl: imageUrl ? String(imageUrl) : null
      }
    });

    // Automatically create inventory record
    await tx.inventory.create({
      data: {
        productId: product.id,
        quantity: product.stock,
        location: 'Default Warehouse'
      }
    });

    return product;
  });
};

const updateProduct = async (id, productData = {}) => {
  const { price, stock, id: _tempId, _id, ...rest } = productData;
  const updateData = { ...rest };

  if (price !== undefined && price !== null && price !== '') {
    updateData.price = parseFloat(price);
  }

  if (stock !== undefined && stock !== null && stock !== '') {
    updateData.stock = parseInt(stock);
  }

  // Pre-clean data for Prisma
  if (updateData.categoryId) updateData.categoryId = String(updateData.categoryId);

  console.log(`[ProductService] Updating ${id} with:`, JSON.stringify(updateData, null, 2));

  return await prisma.product.update({
    where: { id },
    data: updateData
  });
};

const deleteProduct = async (id) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete dependent Inventory record
    await tx.inventory.deleteMany({
      where: { productId: id }
    });

    // 2. Delete dependent Reviews
    await tx.review.deleteMany({
      where: { productId: id }
    });

    // 3. Delete dependent CartItems
    await tx.cartItem.deleteMany({
      where: { productId: id }
    });

    // 4. Finally delete the product
    return await tx.product.delete({
      where: { id }
    });
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
