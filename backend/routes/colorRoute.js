import express from 'express';
import { 
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getallColor
} from '../controller/colorCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-Color', authMiddleware, isAdmin, createColor);
router.put('/update-Color/:id', authMiddleware, isAdmin, updateColor);
router.delete('/delete-Color/:id', authMiddleware, isAdmin, deleteColor);
router.get('/get-Color/:id', getColor);
router.get('/get-colors', getallColor);

export default router;