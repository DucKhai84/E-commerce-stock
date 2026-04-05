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

const getMyOrders = async (requestingUser) => {
  return await prisma.order.findMany({
    where: { userId: requestingUser.id },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
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
    const expiresAt = paymentMethod === 'COD' ? null : new Date(Date.now() + 15 * 60 * 1000);

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: parseFloat(calculatedTotal.toFixed(2)), // Enforce float
        status: 'PENDING',
        expiresAt: expiresAt,
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

    // 4. Stock Management: Subtract physical stock immediately for ALL methods
    for (const item of orderItems) {
      const inventory = await tx.inventory.findUnique({ where: { productId: item.productId } });
      if (!inventory) throw new Error(`Inventory record not found for product ${item.productId}`);

      const available = inventory.quantity - inventory.reserved;
      if (available < item.quantity) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        throw new Error(`Insufficient stock for "${product?.name || item.productId}". Available: ${available}, Required: ${item.quantity}`);
      }

      // Reduce Physical Stock in Product
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });

      // Reduce Physical Quantity and increase Reserved in Inventory
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: { decrement: item.quantity }, // Physical deduction
          reserved: { increment: item.quantity }  // Hold for the timeout
        }
      });
    }

    // 5. Clear the user's reserved items from cart
    const userCartRecord = await tx.cart.findUnique({ where: { userId } });
    if (userCartRecord) {
      await tx.cartItem.deleteMany({
        where: { cartId: userCartRecord.id }
      });
    }

    return order;
  });
};

const updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id },
    data: { status }
  });
};

const finalizeOrderPayment = async (orderId) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    });

    if (!order || order.status === 'PAID') return order;

    // Finalize Stock: Just Release Reserved (Physical was reduced in createOrder)
    for (const item of order.orderItems) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          reserved: { decrement: item.quantity }  // Release hold
        }
      });
    }

    return await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID' }
    });
  });
};

const failOrder = async (orderId, status = 'FAILED') => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true, payment: true }
    });

    if (!order || order.status === 'FAILED' || order.status === 'EXPIRED') return order;

    // Global Rollback: Return physical stock for ANY order that fails/expires
    for (const item of order.orderItems) {
      // Return Physical Stock
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      });

      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: { increment: item.quantity }, // Restore physical
          reserved: { decrement: item.quantity }  // Release hold
        }
      });
    }

    return await tx.order.update({
      where: { id: orderId },
      data: { status }
    });
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



const reserveOrderForPayment = async (orderId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get the order with items
    const order = await tx.order.findUnique({
      where: { id: orderId }
    });

    if (!order) throw new Error('Không tìm thấy đơn hàng');

    // If it's already RESERVED and not expired, just return.
    if (order.status === 'RESERVED') {
      if (order.expiresAt && order.expiresAt > new Date()) return order;
    }

    if (order.status !== 'PENDING' && order.status !== 'RESERVED') {
      throw new Error(`Chỉ có thể thanh toán đơn hàng đang chờ hoặc đang giữ chỗ (PENDING/RESERVED), trạng thái hiện tại: ${order.status}`);
    }

    // 2. Set new Payment Window (10 mins)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    console.log(`[OrderService] Activating 10-min payment window for Order #${orderId.substring(0, 8)}.`);

    return await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'RESERVED',
        expiresAt: expiresAt
      }
    });
  });
};

const releaseExpiredOrders = async () => {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: { in: ['PENDING', 'RESERVED'] },
      expiresAt: { lt: new Date() }
    }
  });

  if (expiredOrders.length === 0) return;

  console.log(`[OrderService] Found ${expiredOrders.length} expired orders (PENDING/RESERVED). Releasing stock back to inventory...`);

  for (const order of expiredOrders) {
    await failOrder(order.id, 'EXPIRED');
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  finalizeOrderPayment,
  failOrder,
  deleteOrder,
  reserveOrderForPayment,
  releaseExpiredOrders,
  getMyOrders
};
