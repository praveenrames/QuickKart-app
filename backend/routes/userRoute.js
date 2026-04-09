import express from 'express';
import { createUser, 
         loginUserCtrl, 
         loginAdmin, 
         handleRefreshToken,
         logout,
         updatedUser,
         saveAddress,
         getallUser,
         getaUser,
         deleteaUser,
         blockUser,
         unblockUser,
         updatePassword,
         forgotPasswordToken,
         resetPassword,
         getWishlist,
         userCart,
         getUserCart,
         createOrder,
         getMyOrders,
         removeProductFromCart,
         emptyCart,
         getMonthWiseOrderIncome,
         getYearlyTotalOrder,
         updateProductQuantityFromCart,
         getAllOrders,
         getsingleOrder,
         updateOrder
} from '../controller/userCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
import { checkout, paymentVerification } from '../controller/PaymentCtrl.js';

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login",  loginAdmin);
router.post("/add-cart", authMiddleware, userCart);
router.post('/order/checkout', authMiddleware, checkout);
router.post('/order/paymentVerification', authMiddleware, paymentVerification);
router.post('/cart/create-order', authMiddleware, createOrder);
router.get('/refresh', handleRefreshToken);
router.get("/logout", logout);
router.put('/edit-user', authMiddleware, updatedUser);
router.put('/save-address', authMiddleware, saveAddress);
router.get("/all-users", getallUser);
router.get('/getmyorders', authMiddleware, getMyOrders);
router.get('/all-orders', authMiddleware, isAdmin, getAllOrders);
router.get('/getaOrder/:id', authMiddleware, isAdmin, getsingleOrder);
router.put('/updateOrder/:id', authMiddleware, isAdmin, updateOrder);
router.get('/getMonthWiseOrderIncome', authMiddleware, getMonthWiseOrderIncome);
router.get('/getyearlyorders', authMiddleware, getYearlyTotalOrder);
router.get("/wishlist", authMiddleware, getWishlist);
router.get('/get-cart', authMiddleware, getUserCart);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteaUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
router.put('/password', authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete('/update-product-cart/:cartItemId/:newQuantity', authMiddleware, updateProductQuantityFromCart);

export default router;