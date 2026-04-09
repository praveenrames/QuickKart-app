import express from 'express';
import {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeTheBlog,
    uploadImages,
    dislikeTheBlog
} from '../controller/blogCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import { blogImgResize, uploadPhoto } from '../middlewares/uploadImage.js';

const router = express.Router();

router.post('/createBlog', authMiddleware, isAdmin, createBlog);

router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 2), blogImgResize, uploadImages);

router.put('/updateBlog/:id', authMiddleware, isAdmin, updateBlog);

router.get('/getBlog/:id', getBlog);

router.get('/getBlogs', getAllBlogs);

router.put('/likes', authMiddleware, likeTheBlog);

router.put('/dislikes', authMiddleware, dislikeTheBlog);

router.delete('/deleteBlog/:id', authMiddleware, isAdmin, deleteBlog);

export default router;