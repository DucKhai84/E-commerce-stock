const prisma = require('../config/prisma');

const addToWishlist = async (userId, productId) => {
    // Check if it already exists
    const existing = await prisma.wishlist.findFirst({
        where: { userId, productId }
    });

    if (existing) return existing;

    return await prisma.wishlist.create({
        data: { userId, productId }
    });
};

const getWishlist = async (userId) => {
    return await prisma.wishlist.findMany({
        where: { userId },
        include: { product: true }
    });
};

const removeFromWishlist = async (userId, productId) => {
    const item = await prisma.wishlist.findFirst({
        where: { userId, productId }
    });

    if (!item) throw new Error('Item not in wishlist');

    return await prisma.wishlist.delete({
        where: { id: item.id }
    });
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
