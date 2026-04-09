import express from 'express';
import { uploadImages, deleteImages } from '../controller/uploadCtrl.js';
import { isAdmin, authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadPhoto, productImagResize } from '../middlewares/uploadImage.js';

const router = express.Router();


router.post('/', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImagResize, uploadImages);
router.delete('/delete/:id', authMiddleware, isAdmin, deleteImages);

export default router;
