const prisma = require('../config/prisma');

const getCart = async (userId) => {
  // Lazy cleanup of expired items for this user before returning cart
  await releaseExpiredReservations(userId);

  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        where: { status: 'RESERVED' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true
            }
          }
        }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { cartItems: true }
    });
  }

  return cart;
};

const addToCart = async (userId, cartItemData) => {
  const { productId, quantity } = cartItemData;
  const cart = await getCart(userId);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  return await prisma.$transaction(async (tx) => {
    // 1. Check stock availability in Inventory
    const inventory = await tx.inventory.findUnique({
      where: { productId },
      select: { quantity: true, reserved: true }
    });

    if (!inventory) throw new Error('Sản phẩm không có trong kho');
    const available = inventory.quantity - inventory.reserved;
    if (available < quantity) throw new Error('Sản phẩm đã hết hàng hoặc đang được người khác giữ');

    // 2. Reserve stock
    await tx.inventory.update({
      where: { productId },
      data: { reserved: { increment: quantity } }
    });

    // 3. Create or Update CartItem
    const existingItem = await tx.cartItem.findFirst({
      where: { cartId: cart.id, productId, status: 'RESERVED' }
    });

    if (existingItem) {
      return await tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          expiresAt
        }
      });
    }

    return await tx.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        status: 'RESERVED',
        expiresAt
      }
    });
  });
};

const updateCartItem = async (cartItemId, quantity, requestingUser) => {
  return await prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    });
    if (!item) throw new Error('Mục không tồn tại');
    if (item.cart.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
      throw new Error('Từ chối truy cập');
    }

    const diff = quantity - item.quantity;
    if (diff > 0) {
      // Check stock for the extra amount
      const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
      if (!inv || (inv.quantity - inv.reserved) < diff) throw new Error('Không đủ hàng');
      await tx.inventory.update({ where: { productId: item.productId }, data: { reserved: { increment: diff } } });
    } else if (diff < 0) {
      await tx.inventory.update({ where: { productId: item.productId }, data: { reserved: { decrement: Math.abs(diff) } } });
    }

    return await tx.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
  });
};

const removeFromCart = async (cartItemId, requestingUser) => {
  return await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    });

    if (!cartItem) throw new Error('Không tìm thấy mục trong giỏ');
    if (cartItem.cart.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
      throw new Error('Từ chối truy cập');
    }

    // Release stock if it was reserved
    if (cartItem.status === 'RESERVED') {
      await tx.inventory.update({
        where: { productId: cartItem.productId },
        data: { reserved: { decrement: cartItem.quantity } }
      });
    }

    return await tx.cartItem.delete({
      where: { id: cartItemId }
    });
  });
};

const releaseExpiredReservations = async (userId = null) => {
  const now = new Date();
  const where = {
    status: 'RESERVED',
    expiresAt: { lt: now }
  };
  if (userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) where.cartId = cart.id;
  }

  const expiredItems = await prisma.cartItem.findMany({ where });

  if (expiredItems.length === 0) return;

  await prisma.$transaction(async (tx) => {
    for (const item of expiredItems) {
      // 1. Release from Inventory
      await tx.inventory.update({
        where: { productId: item.productId },
        data: { reserved: { decrement: item.quantity } }
      });

      // 2. Mark as expired or Delete
      await tx.cartItem.delete({ where: { id: item.id } });
    }
  });
};

const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  return await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  releaseExpiredReservations
};
