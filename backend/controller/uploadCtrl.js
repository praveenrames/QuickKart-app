import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { 
    cloudinaryUploadImg,
    cloudinaryDeleteImg
} from '../utils/cloudinary.js';

export const uploadImages = asyncHandler(async (req, res) => {
    try {
        const uploader = async (filePath) => await cloudinaryUploadImg(filePath);
        const urls = [];
        const files = req.files;
        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: 'No images provided to upload' });
        }
        
        for (const file of files) {
            const filePath = file.path.replace('public\\images\\', 'public\\images\\products\\');
            const newpath = await uploader(filePath);
            urls.push(newpath);
        }
        
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload images', error: error.message});
    }
});

export const deleteImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await cloudinaryDeleteImg(id, "images");
        res.status(200).json({ message: 'Image deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete image', error: error.message });
    }
});

