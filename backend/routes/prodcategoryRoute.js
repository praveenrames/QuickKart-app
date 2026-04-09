import express from 'express';
import { 
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory
} from '../controller/prodcategoryCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createCategory', authMiddleware, isAdmin, createCategory);
router.put('/updateCategory/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/deleteCategory/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/getCategory/:id', getCategory);
router.get('/getallCategory', getallCategory);

export default router;