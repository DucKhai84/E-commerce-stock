const addressService = require('../services/addressService');

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getUserAddresses(req.user.userId);
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const address = await addressService.addAddress(req.user.userId, req.body);
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await addressService.updateAddress(req.params.id, req.body, req.user);
    res.status(200).json(address);
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await addressService.deleteAddress(req.params.id, req.user);
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress
};
