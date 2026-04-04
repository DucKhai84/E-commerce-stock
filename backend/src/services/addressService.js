const prisma = require('../config/prisma');

const getUserAddresses = async (userId) => {
  return await prisma.address.findMany({
    where: { userId }
  });
};

const getAddressById = async (id, requestingUser) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) return null;

  if (address.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
    throw new Error('Access denied');
  }

  return address;
};

const addAddress = async (userId, addressData) => {
  return await prisma.address.create({
    data: {
      userId,
      ...addressData
    }
  });
};

const updateAddress = async (id, addressData, requestingUser) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) throw new Error('Address not found');

  if (address.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
    throw new Error('Access denied');
  }

  return await prisma.address.update({
    where: { id },
    data: addressData
  });
};

const deleteAddress = async (id, requestingUser) => {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) throw new Error('Address not found');

  if (address.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
    throw new Error('Access denied');
  }

  return await prisma.address.delete({
    where: { id }
  });
};

module.exports = {
  getUserAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress
};
