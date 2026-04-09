import Enquiry from '../models/enqModel.js';
import asyncHandler from 'express-async-handler';
import validateMongoDbId from '../utils/validateMongoDbId.js';


// Create a new enquiry

export const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.status(201).json({message: 'Enquiry created successfully', newEnquiry});
    } catch (error) {
        res.status(500).json({message: 'Failed to create enquiry', error: error.message});
    }
})

// Update an existing enquiry

export const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
            new:true,
        });
        res.status(200).json({message: 'Enquiry updated successfully', updatedEnquiry})
    } catch (error) {
        res.status(500).json({message: 'Failed to update enquiry', error: error.message});
    }
});

// Delete an enquiry

export const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        res.status(200).json({message: 'Enquiry deleted successfully', deletedEnquiry})
    } catch (error) {
        res.status(500).json({message: 'Failed to delete enquiry', error: error.message});
    }
});


// Get all enquiries

export const getAllEnquiries = asyncHandler(async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.status(200).json({message: 'Enquiries retrieved successfully', enquiries})
    } catch (error) {
        res.status(500).json({message: 'Failed to retrieve enquiries', error: error.message});
    }
});

// Get a single enquiry by ID

export const getEnquiryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const enquiry = await Enquiry.findById(id);
        if (!enquiry) {
            return res.status(404).json({message: 'Enquiry not found'});
        }
        res.status(200).json({message: 'Enquiry retrieved successfully', enquiry})
    } catch (error) {
        res.status(500).json({message: 'Failed to retrieve enquiry', error: error.message});
    }
});
