const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login
};
