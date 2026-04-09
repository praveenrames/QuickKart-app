import express from 'express';
import {
    createCategory,
    deleteCategory,
    getCategory,
    updateCategory,
    getAllCategories
} from '../controller/blogCatCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);

router.put('/updateCategory/:id', authMiddleware, isAdmin, updateCategory);

router.delete('/deleteCategory/:id', authMiddleware, isAdmin, deleteCategory);

router.get('/getCategory/:id', getCategory);

router.get('/getCategories', getAllCategories)

export default router;
