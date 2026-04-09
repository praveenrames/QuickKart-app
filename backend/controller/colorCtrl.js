import Color from '../models/colorModel.js';
import asyncHandler from 'express-async-handler';
import validateMongoDbId from '../utils/validateMongoDbId.js';

export const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.status(200).json({message: 'Color Added', newColor})
    } catch (error) {
        res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});

export const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json({message: 'Color updated', updatedColor})
    } catch (error) {
        res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});

export const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedColor = await Color.findByIdAndDelete(id);
        res.status(200).json({message: 'Delete Color', deletedColor})
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message})
    }
});


export const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getColor = await Color.findById(id);
        res.status(200).json({message: 'Color Details', getColor})
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message})
    }
});


export const getallColor = asyncHandler(async (req, res) => {
    try {
        const getallColors = await Color.find();
        res.status(200).json({message: 'Get all the color', getallColors})
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message})
    }
});


