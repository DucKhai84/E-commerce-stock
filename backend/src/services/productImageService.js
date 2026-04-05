const prisma = require('../config/prisma');

const addImageToProduct = async (productId, imageData) => {
    const { url, isMain = false } = imageData;

    return await prisma.$transaction(async (tx) => {
        // Validation: If set as main, unset all other main images for this product
        if (isMain) {
            await tx.productImage.updateMany({
                where: { productId, isMain: true },
                data: { isMain: false }
            });
        }

        // Check if product exists
        const product = await tx.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');

        return await tx.productImage.create({
            data: { productId, url, isMain }
        });
    });
};

const getProductImages = async (productId) => {
    return await prisma.productImage.findMany({
        where: { productId }
    });
};

const updateImage = async (id, updateData) => {
    const { isMain } = updateData;

    return await prisma.$transaction(async (tx) => {
        const image = await tx.productImage.findUnique({ where: { id } });
        if (!image) throw new Error('Image not found');

        if (isMain) {
            // Unset current main for this product
            await tx.productImage.updateMany({
                where: { productId: image.productId, isMain: true },
                data: { isMain: false }
            });
        }

        return await tx.productImage.update({
            where: { id },
            data: { isMain }
        });
    });
};

const deleteImage = async (id) => {
    return await prisma.productImage.delete({ where: { id } });
};

module.exports = {
    addImageToProduct,
    getProductImages,
    updateImage,
    deleteImage
};
