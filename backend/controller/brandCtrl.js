import Brand from '../models/brandModel.js';
import asyncHandler from 'express-async-handler';
import validateMongoDbId from '../utils/validateMongoDbId.js';

// Create Brand

export const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.status(200).json({message: 'successfully create Brand', newBrand});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});

// Update Brand

export const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatebrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json({message: 'Brand Update successfully', updatebrand});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});


// Delete Brand

export const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBrands = await Brand.findByIdAndDelete(id);
        res.status(200).json({deleteBrands})
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});


// Get Brand Details

export const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaBrand = await Brand.findById(id);
        res.status(200).json({message: 'Brand Details', getaBrand})
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message})
    }
});


// Get all Brands

export const getallBrands = asyncHandler(async (req, res) => {
    try {
        const getBrands = await Brand.find();
        res.status(200).json({message: 'Get All Brands', getBrands});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message})
    }
});