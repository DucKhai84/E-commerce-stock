const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const register = async (userData) => {
  const { fullName, email, password } = userData;
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user - Force role to USER
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: 'USER'
    }
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword
  };
};

module.exports = {
  register,
  login
};
