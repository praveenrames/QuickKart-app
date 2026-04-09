import coupon from "../models/couponModel.js";
import validateMongoDbId from "../utils/validateMongoDbId.js";
import asynHandler from 'express-async-handler';


// create coupon

export const createCoupon = asynHandler(async (req, res) => {
    try {
        const newCoupon = await coupon.create(req.body);
        res.status(200).json({message: 'Coupon created successfully', newCoupon})
    } catch (error) {
        res.status(500).json({message: 'Error creating coupon', error: error.message});
    }
})

// update coupon details 

export const updateCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCoupon = await coupon.findByIdAndUpdate(id, req.body, { 
            new: true 
        });
        res.status(200).json({message: 'Coupon updated successfully', updatedCoupon});
    } catch (error) {
        res.status(500).json({message: 'Error updating coupon', error: error.message});
    }
});

// delete coupon 

export const deleteCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCoupon = await coupon.findByIdAndDelete(id);
        res.status(200).json({message: 'Coupon deleted successfully', deletedCoupon});
    } catch (error) {
        res.status(500).json({message: 'Error deleting coupon', error: error.message});
    }
});

// get single coupon

export const getsingleCoupon = asynHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const singleCoupon = await coupon.findById(id);
        if (!singleCoupon) {
            return res.status(404).json({message: 'Coupon not found'});
        }
        res.status(200).json({message: 'Coupon retrieved successfully', singleCoupon});
    } catch (error) {
        res.status(500).json({message: 'Error retrieving coupon', error: error.message});
    }
});

// get all coupons

export const getallCoupons = asynHandler(async (req, res) => {
    try {
        const allcoupons = await coupon.find();
        res.status(200).json({message: 'Coupons retrieved successfully', allcoupons});
    } catch (error) {
        res.status(500).json({message: 'Error retrieving coupons', error: error.message});
    }
});