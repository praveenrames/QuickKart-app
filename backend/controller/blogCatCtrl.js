import Category from '../models/blogCatModel.js';
import asyncHandler from 'express-async-handler';
import validateMongoDbId from '../utils/validateMongoDbId.js';

// create Category 

export const createCategory = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;
        let alreadyCategory = await Category.find({title: title});
        if (alreadyCategory.length > 0) {
            return res.status(400).json({message: 'Category already exists'});
        }
        const newCategory = await Category.create({title: title});
        res.status(200).json({message: 'Category created successfully', newCategory})
    } catch (error) {
        res.status(500).json({message: 'Error creating category', error: error.message});
    }
});


// update Category

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const checkCategory = await Category.findById(id);
        if (!checkCategory){
            return res.status(404).json({message: 'Category not found'})
        };
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.status(200).json({message: 'Category updated successfully', updatedCategory})
    } catch (error) {
        res.status(500).json({message: 'Error updating category', error: error.message});
    }
});


// Delete Category 


export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const checkCategory = await Category.findById(id);
        if (!checkCategory){
            return res.status(404).json({message: 'Category not found'})
        }
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.status(200).json({message: 'Category deleted successfully', deletedCategory})
    } catch (error) {
        res.status(500).json({message: 'Error deleting category', error: error.message});
    }
});

// Get Category

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const checkCategory = await Category.findById(id);
        if (!checkCategory){
            return res.status(404).json({message: 'Category not found'})
        }
        const getCategory = await Category.findById(id);
        res.status(200).json({message: 'Category fetched successfully', getCategory})
    } catch (error) {
        res.status(500).json({message: 'Error fetching category', error: error.message});
    }
});


// Get all categories

export const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getCategories = await Category.find();
        res.status(200).json({message: 'Categories fetched successfully', getCategories})
    } catch (error) {
        res.status(500).json({message: 'Error fetching categories', error: error.message});
    }
});


