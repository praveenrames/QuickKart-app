import express from 'express';
import { 
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getsingleCoupon,
    getallCoupons
} from '../controller/couponCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createCoupon', authMiddleware, isAdmin, createCoupon);
router.put('/updateCoupon/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/deleteCoupon/:id', authMiddleware, isAdmin, deleteCoupon);
router.get('/getCoupon/:id', getsingleCoupon);
router.get('/getCoupons', getallCoupons);


export default router;