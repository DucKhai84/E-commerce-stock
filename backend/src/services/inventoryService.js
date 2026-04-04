const prisma = require('../config/prisma');

const getAllInventories = async () => {
  return await prisma.inventory.findMany({
    include: {
      product: {
        select: {
          name: true,
          price: true
        }
      }
    }
  });
};

const getInventoryById = async (id) => {
  return await prisma.inventory.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          name: true,
          price: true
        }
      }
    }
  });
};

const createInventory = async (inventoryData) => {
  return await prisma.inventory.create({
    data: inventoryData
  });
};

const updateInventory = async (id, inventoryData) => {
  return await prisma.inventory.update({
    where: { id },
    data: inventoryData
  });
};

const deleteInventory = async (id) => {
  return await prisma.inventory.delete({
    where: { id }
  });
};

module.exports = {
  getAllInventories,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
};
