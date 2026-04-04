const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

const getUserById = async (id, requestingUser) => {
  // Ownership check
  if (requestingUser.role !== 'ADMIN' && requestingUser.userId !== id) {
    throw new Error('Access denied: You can only view your own profile');
  }

  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

const createUser = async (userData) => {
  const { password, ...rest } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword
    }
  });
};

const updateUser = async (id, userData, requestingUser) => {
  // Ownership check
  if (requestingUser.role !== 'ADMIN' && requestingUser.userId !== id) {
    throw new Error('Access denied: You can only update your own profile');
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  // Do not allow USER to change their own role
  if (requestingUser.role !== 'ADMIN' && userData.role) {
    delete userData.role;
  }

  return await prisma.user.update({
    where: { id },
    data: userData
  });
};

const deleteUser = async (id, requestingUser) => {
  // Ownership check
  if (requestingUser.role !== 'ADMIN' && requestingUser.userId !== id) {
    throw new Error('Access denied: You can only delete your own account');
  }

  return await prisma.user.delete({
    where: { id }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
