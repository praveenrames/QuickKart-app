import express from 'express';
import { 
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrands
} from '../controller/brandCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createBrand', authMiddleware, isAdmin, createBrand);
router.put('/updateBrand/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/deleteBrand/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/getbrand/:id', getBrand);
router.get('/getallbrands', getallBrands);

export default router;