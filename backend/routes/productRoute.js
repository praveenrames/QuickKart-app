import express from 'express';
import { 
    createProduct, 
    updateProduct,
    deleteProducts,
    getaProduct,
    getAllProduct,
    addToWishlist,
    rating
 } from '../controller/productCtrl.js';
import { isAdmin, authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-product', authMiddleware, isAdmin, createProduct);
router.get('/get-product/:id', getaProduct);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/update-product/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/remove-product/:id', authMiddleware, isAdmin, deleteProducts);
router.put('/rating', authMiddleware, rating);
router.get('/get-products', getAllProduct);

export default router;