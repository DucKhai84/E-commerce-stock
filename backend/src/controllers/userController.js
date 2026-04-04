const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id, req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    res.status(200).json(user);
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    const status = error.message.includes('Access denied') ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
