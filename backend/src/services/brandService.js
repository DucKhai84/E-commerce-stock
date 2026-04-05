const prisma = require('../config/prisma');

const getAllBrands = async () => {
    return await prisma.brand.findMany({
        include: { _count: { select: { products: true } } }
    });
};

const getBrandById = async (id) => {
    return await prisma.brand.findUnique({
        where: { id },
        include: { products: true }
    });
};

const createBrand = async (brandData) => {
    const { name, description, logoUrl } = brandData;

    const existing = await prisma.brand.findUnique({ where: { name } });
    if (existing) throw new Error('Brand name already exists');

    return await prisma.brand.create({
        data: { name, description, logoUrl }
    });
};

const updateBrand = async (id, brandData) => {
    return await prisma.brand.update({
        where: { id },
        data: brandData
    });
};

const deleteBrand = async (id) => {
    // Check if brand has products
    const brand = await prisma.brand.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } }
    });

    if (!brand) throw new Error('Brand not found');
    if (brand._count.products > 0) {
        throw new Error('Cannot delete brand with existing products');
    }

    return await prisma.brand.delete({ where: { id } });
};

module.exports = {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
};
