const cartService = require('../services/cartService');

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const item = await cartService.addToCart(req.user.userId, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const item = await cartService.updateCartItem(req.params.id, req.body.quantity, req.user);
    res.status(200).json(item);
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await cartService.removeFromCart(req.params.id, req.user);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
