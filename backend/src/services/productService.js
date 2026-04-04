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

const createProduct = async (productData) => {
  if (productData.price <= 0) {
    throw new Error('Price must be greater than zero');
  }

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: productData
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

const updateProduct = async (id, productData) => {
  return await prisma.product.update({
    where: { id },
    data: productData
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
