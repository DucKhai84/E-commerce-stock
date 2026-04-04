const prisma = require('../config/prisma');

const getAllOrders = async (requestingUser) => {
  const where = requestingUser.role === 'ADMIN' ? {} : { userId: requestingUser.userId };

  return await prisma.order.findMany({
    where,
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      },
      orderItems: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      },
      payment: true
    }
  });
};

const getOrderById = async (id, requestingUser) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          fullName: true,
          email: true
        }
      },
      orderItems: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      },
      payment: true
    }
  });

  if (!order) return null;

  // Ownership check
  if (requestingUser.role !== 'ADMIN' && order.userId !== requestingUser.userId) {
    throw new Error('Access denied: You can only view your own orders');
  }

  return order;
};



const createOrder = async (orderData, requestingUser) => {
  const userId = requestingUser.role === 'ADMIN' ? (orderData.userId || requestingUser.userId) : requestingUser.userId;
  const { totalAmount, orderItems, paymentMethod = 'COD' } = orderData;

  return await prisma.$transaction(async (tx) => {
    // 1. Validate that items are still RESERVED in the cart and not EXPIRED
    const userCart = await tx.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          where: { status: 'RESERVED' },
          include: { product: true } // Need product price for total calculation
        }
      }
    });

    if (!userCart || userCart.cartItems.length === 0) {
      throw new Error('Giỏ hàng trống hoặc phiên giữ hàng đã hết hạn. Vui lòng thêm lại sản phẩm.');
    }

    // Verify each ordered item exists in the reserved cart items and Calculate Total
    let calculatedTotal = 0;
    for (const item of orderItems) {
      const reservedItem = userCart.cartItems.find(ci => ci.productId === item.productId);
      if (!reservedItem) {
        throw new Error(`Sản phẩm ${item.productId} không còn trong trạng thái giữ hàng.`);
      }
      if (reservedItem.expiresAt && reservedItem.expiresAt < new Date()) {
        throw new Error(`Phiên giữ hàng cho sản phẩm ${item.productId} đã hết hạn.`);
      }
      calculatedTotal += (reservedItem.product.price || 0) * (reservedItem.quantity || 0);
    }

    console.log(`[OrderService] User: ${userId}, Calculated Total: ${calculatedTotal}`);

    if (isNaN(calculatedTotal) || calculatedTotal <= 0) {
      throw new Error('Không thể tính toán tổng giá trị đơn hàng hợp lệ.');
    }

    // 2. Create the order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: parseFloat(calculatedTotal.toFixed(2)), // Enforce float
        status: 'PENDING',
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { orderItems: true }
    });

    // 3. Create the payment record
    await tx.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount, // Use the amount saved in the order
        method: paymentMethod,
        status: 'PENDING'
      }
    });

    // 4. Finalize Stock: Physical Reduction
    for (const item of orderItems) {
      // Reduce Physical Stock in Product
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });

      // Reduce Physical Quantity and Release Reserved in Inventory
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: { decrement: item.quantity }, // Permanent reduction
          reserved: { decrement: item.quantity }  // Release hold
        }
      });
    }

    // 5. Clear the user's reserved items
    await tx.cartItem.deleteMany({
      where: { cartId: userCart.id, status: 'RESERVED' }
    });

    return order;
  });
};

const updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id },
    data: { status }
  });
};

const deleteOrder = async (id, requestingUser) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error('Order not found');

  // Ownership check
  if (requestingUser.role !== 'ADMIN' && order.userId !== requestingUser.userId) {
    throw new Error('Access denied: You can only delete your own orders');
  }

  await prisma.orderItem.deleteMany({
    where: { orderId: id }
  });

  return await prisma.order.delete({
    where: { id }
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
