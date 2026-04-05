const brandService = require('../services/brandService');

const getAllBrands = async (req, res) => {
    try {
        const brands = await brandService.getAllBrands();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBrandById = async (req, res) => {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBrand = async (req, res) => {
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateBrand = async (req, res) => {
    try {
        const brand = await brandService.updateBrand(req.params.id, req.body);
        res.status(200).json(brand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
        await brandService.deleteBrand(req.params.id);
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
};
