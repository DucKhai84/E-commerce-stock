const wishlistService = require('../services/wishlistService');

const addToWishlist = async (req, res) => {
    try {
        const item = await wishlistService.addToWishlist(req.user.userId, req.body.productId);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const items = await wishlistService.getWishlist(req.user.userId);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        await wishlistService.removeFromWishlist(req.user.userId, req.params.productId);
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
