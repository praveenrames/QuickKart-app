import Product from "../models/productModel.js";
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import slugify from "slugify";
import validateMongoDbId from "../utils/validateMongoDbId.js";


// create Product

export const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        // Check if product already exists
        const existingProduct = await Product.findOne({ title: req.body.title });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        const newProduct = await Product.create(req.body);
        return res.status(200).json({message: 'Create Product successfully', newProduct});
    } catch (error) {
        return res.status(400).json({message: 'Internal server error', error: error.message});
    }
});


// update Product

export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        } else {
            delete req.body.slug;
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json({message: 'Product Update successfully', updateProduct})
    } catch (error) {
        return res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});


// Delete Product 

export const deleteProducts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.status(200).json({message: 'Product removed successfully', deletedProduct})
    } catch (error) {
        res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});


// Get Product

export const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id).populate('color');
        return res.status(200).json({message: 'Find Product successfully', findProduct});
    } catch (error) {
        return res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});


// Get all Products

export const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // Search  by title
        if (req.query.search) {
            query = query.find({ title: { $regex: req.query.search, $options: 'i' } });
        }

        // Sorting
        if (req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt")
        }

        // limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        // pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page){
            const productCount = await Product.countDocuments();
            if (skip >= productCount){
                res.status(400).json({message: 'This Page does not exists'})
            }
        }
        const product = await query;
        res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});


// add To Wishlist

export const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded){
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId }
                },
                {
                    new: true,
                }
            );
            return res.status(200).json({message: 'Removed from Wishlist', user})
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId }
                },
                {
                    new: true,
                }
            );
            return res.status(200).json({message: 'Added to wishlist', user})
        }
    } catch (error) {
        return res.status(400).json({message: 'Internal Server Error', error: error.message})
    }
});

// // add rating 

export const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let alreadyRated = product.ratings.find(
            (rating) => rating.postedby && rating.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
       res.status(400).json({message: 'Internal server Error', error: error.message});
    }
});





