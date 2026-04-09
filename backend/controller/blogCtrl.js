import Blog from '../models/blogModel.js';
import user from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import validateMongoDbId from '../utils/validateMongoDbId.js';
import { cloudinaryUploadImg } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';

export const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(200).json({message: 'Blog created successfully', newBlog});
    } catch (error) {
        res.status(500).json({message: 'Error creating blog', error: error.message});
    }
});

// update blog 

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json({message: 'Blog updated successfully', updatedBlog})
    } catch (error) {
        res.status(500).json({message: 'Error updating blog', error: error.message});
    }
});

// Get Blog

export const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id)
        .populate('likes')
        .populate('dislikes');
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );
        res.status(200).json({message: 'Blog fetched successfully', getBlog})
    } catch (error) {
        res.status(500).json({message: 'Error fetching blog', error: error.message});
    }
});

// Get all blogs 

export const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.status(200).json({message: 'Blogs fetched successfully', getBlogs})
    } catch (error) {
        res.status(500).json({message: 'Error fetching blogs', error: error.message});
    }
});

// delete blog

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.status(200).json({message: 'Blog deleted successfully', deletedBlog})
    } catch (error) {
        res.status(500).json({message: 'Error deleting blog', error: error.message});
    }
});


// like blog

export const likeTheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // check if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.status(200).json({message: 'Blog disliked successfully', blog});
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.status(200).json({message: 'Blog liked successfully', blog});
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.status(200).json({message: 'Blog liked successfully', blog});
    }
});


// dislike blog

export const dislikeTheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId);
    // find the login user 
    const loginUserId = req?.user?._id;
    // check if the user has disliked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has liked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.status(200).json({message: 'Blog Disliked successfully', blog});
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.status(200).json({message: 'Blog disliked successfully', blog});
    }
});

// upload blog images
export const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = async (filePath) => await cloudinaryUploadImg(filePath);
        const urls = [];
        const files = req.files;

        // guard against missing or malformed files list
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: 'No images provided to upload' });
        }

        for (const file of files) {
            let filePath = file.path;
            if (filePath.includes(`${path.sep}images${path.sep}`)) {
                filePath = filePath.replace(
                    `${path.sep}images${path.sep}`,
                    `${path.sep}images${path.sep}blogs${path.sep}`
                );
            }
            const newpath = await uploader(filePath);
            urls.push(newpath);

            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error('Error deleting temp file:', err);
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { images: urls },
            { new: true }
        );

        res.status(200).json({ message: 'Blog images uploaded successfully', updatedBlog });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading blog images', error: error.message });
    }
});


