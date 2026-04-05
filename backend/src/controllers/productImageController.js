const productImageService = require('../services/productImageService');

const addImage = async (req, res) => {
    try {
        const image = await productImageService.addImageToProduct(req.params.productId, req.body);
        res.status(201).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await productImageService.getProductImages(req.params.productId);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateImage = async (req, res) => {
    try {
        const image = await productImageService.updateImage(req.params.id, req.body);
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteImage = async (req, res) => {
    try {
        await productImageService.deleteImage(req.params.id);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addImage,
    getImages,
    updateImage,
    deleteImage
};
