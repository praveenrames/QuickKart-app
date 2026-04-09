import Category from "../models/prodcategoryModel.js";
import asyncHandler from 'express-async-handler';
import validateMongoDbId from "../utils/validateMongoDbId.js";

// Create Category

export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(200).json({message: 'successfully create category', newCategory});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});

// Update Category 

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCategorys = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json({message: 'successfully update Category', updateCategorys});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
})


// delete Category

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.status(200).json({message: 'successfully delete category', deleteCategory})
    } catch (error) {
        res.status(404).json({message: 'Internal server error', error: error.message});
    }
})

// Get Category

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getCategorybyId = await Category.findById(id);
        res.status(200).json({getCategorybyId});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});

// Get all Category

export const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategorys = await Category.find();
        res.status(200).json({getallCategorys});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
})
