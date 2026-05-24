import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import bcrypt from 'bcrypt';
import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';
// import uniqid from 'uniqid';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../config/jwtToken.js';
import validateMongoDbId from '../utils/validateMongoDbId.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from './emailCtrl.js';

// Create a User -------------------------------------------------------------------

export const createUser = asyncHandler(async (req, res) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
    const email = req.body.email;
    if (!emailPattern.test(email)){
        return res.status(400).json({message: "Provide Valid Email"})
    }
    const findUser = await User.findOne({ email: email });
    if (!findUser){
        const newUser = await User.create(req.body);
        return res.status(200).json({message: "User created successfully", newUser});
    }else {
        return res.status(401).json({message: "User alredy register"})
    }
    } catch (error) {
        return res.status(401).json({message: "Internal server Error", error: error.message})
    }
});

// Login a user

export const loginUserCtrl = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const findUser = await User.findOne({ email });
        
        if (findUser) {
            const isPasswordMatch = await findUser.isPasswordMatched(password);
            console.log('Password match result:', isPasswordMatch);
            
            if (isPasswordMatch) {
                const refreshToken = await generateToken(findUser._id);
                const updateuser = await User.findByIdAndUpdate(
                    findUser._id,
                    { refreshToken: refreshToken },
                    { new: true }
                );
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    message : 'User Login successfully',
                    _id: findUser._id,
                    firstname: findUser.firstname,
                    lastname: findUser.lastname,
                    email: findUser.email,
                    mobile: findUser.mobile,
                    role: findUser.role,
                    token: generateToken(findUser._id),
                });
            } else {
                return res.status(401).json({message: 'Invalid email or password'});
            }
        } else {
            return res.status(401).json({message: 'Invalid email or password'});
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({message: 'Internal server Error', error: error.message});
    }
});


// admin login

export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (!findAdmin || findAdmin.role !== 'admin'){
        return res.status(401).json({message: "Not Admin user"})
    }
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await  generateToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.status(200).json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        return res.status(401).json({message: "Invalid Password Curdential"})
    }
});


// handle refresh token

export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken){
        return res.status(401).json({ message: 'No Refresh Token in Cookies'});
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user){
        return res.status(404).json({message: 'No Refresh token present in db or not matched'});
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user._id.toString() !== decoded.id){
            return res.status(401).json({message: 'There is something wrong with refresh token'})
        }
        const accessToken = generateToken(user._id);
        res.json({ accessToken });
    });
});


// logout functionality

export const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken){
        return res.status(401).json({message: 'No Refresh Token in Cookies'});
    }
    try {
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    await User.findByIdAndUpdate(user._id, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken",  {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
    } catch (error) {
        res.status(404).json({message: 'Internal server error', error: error.message});
    }
});


// Update a user details

export const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        );
        res.status(200).json({message: 'User Updated sucessfully', updatedUser})
    } catch (error) {
        return res.status(404).json({message: "Internal server error", error: error.message})
    }
});


// save user Address

export const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            {
                new: true,
            }
        );
        res.status(200).json({message: 'User Address updated successfully', updatedUser})
    } catch (error) {
        return res.status(404).json({message: 'Internal server Error', error: error.message})
    }
});


// Get all users

export const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find().populate("wishlist");
        res.status(200).json({getUsers});
    } catch (error) {
        res.status(401).json({message: 'Internal server Error', error: error.message})
    }
});


// Get a single user

export const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaUser = await User.findById(id);
        res.status(200).json({getaUser});
    } catch (error) {
        return res.status(404).json({message: 'Internal server Error', error: error.message});
    }
});

// delete user

export const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.status(200).json({message: "User deleted successfully", deleteaUser});
    } catch (error) {
        res.status(404).json({message: 'Internal server Error', error: error.message});
    }
})

// block user Details

export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const blockusers = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.status(200).json({blockusers});
    } catch (error) {
        res.status(400).json({message: "Internal server Error", error: error.message});
    }
});


// unblock User details

export const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.status(200).json({message: "User UnBlocked", unblock})
    } catch (error) {
        res.status(404).json({message: 'Internal server Error', error: error.message});
    }
});


// Update user Password 

export const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    try {
        if (user && (await user.isPasswordMatched(password))){
            res.status(400).json({message: 'New password must be different from the current password'})
        } else {
        user.password = password;
        const updatedPassword = await user.save();
        res.status(200).json({message: 'User Password Updated', updatedPassword})
        }
    } catch (error) {
        res.status(404).json({message: 'Internal server Error', error: error.message})
    }
});


// forgot Password function

export const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user){
        return res.status(404).json({message: 'User not found with this email'})
    }
    try {
        const token = await user.createPasswordResetToken();

        await user.save();

        const resetURL = `
              <p>Dear: ${user.firstname}</P>
              <p>Please Click the following link to reset your passsword:</P>
              <a href='http://localhost:3000/reset-password/${token}'>Reset Password</a>
              <p>Thank you</p>  
            `;

        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL,
        };
        sendEmail(data);  
        res.json(token)
    } catch (error) {
        return res.status(404).json({message: "Internal server Error", error: error.message});
    }
});


// reset user password

export const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Validate password input
    if (!password || typeof password !== 'string') {
        return res.status(400).json({message: 'Password is required and must be a string'});
    }

    // validate token input
    if (!token){
        return res.status(404).json({message: "token not atteched"});
    }
    
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user){
        return res.status(404).json({message: 'Token Expired or Invalid, Please try again later'});
    }
    
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({message: "Password Reset Done", user});
});


// Get User Wishlist 

export const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        if (!findUser){
            return res.status(404).json({message: 'User not found'})
        }
        return res.status(200).json({message: 'User Wishlist details', findUser});
    } catch (error) {
        return res.status(202).json({message: 'Internal server Error', error: error.message})
    }
});



// create user cart 

export const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        let newCart = await new Cart({
            userId: _id,
            productId,
            color,
            price,
            quantity
        })
        if (!newCart.color && !newCart.price && !newCart.quantity){
            return res.status(404).json({message: 'Provide all required filds'})
        }
        await newCart.save();
        return res.status(200).json({message: 'Cart added', newCart})
    } catch (error) {
        return res.status(404).json({message: 'Internal server Error', error: error.message})
    }
});


// Get user cart

export const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.find({ userId: _id })
        .populate("productId")
        .populate("color");
        return res.status(200).json({message: 'User Cart Details', cart})
    } catch (error) {
        return res.status(404).json({message: 'Internal server Error', error: error.message})
    }
});



// remove Product cart

export const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    validateMongoDbId(_id);
    try {
       const deleteProductFromCart = await Cart.deleteOne({
          userId: _id,
          _id: cartItemId,
       });
       res.status(200).json({message:'Cart Product removed successfully'})
    } catch (error) {
        return res.status(400).json({message: 'Internal server Error', error: error.message})
    }
});

// empty Cart 

export const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const deleteCart = await Cart.deleteMany({
            userId: _id,
        });
        return res.status(200).json({message: 'Cart is empty', deleteCart});
    } catch (error) {
        return res.status(404).json({message: 'Internal server error', error: error.message});
    }
});

// update the product quantity

export const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.params;
    validateMongoDbId(_id);
    try {
        const cartItem = await Cart.findOne({
            userId: _id,
            _id: cartItemId,
        });
        if (!cartItem) {
            return res.status(404).json({message: 'Cart item not found'});
        }
        cartItem.quantity = newQuantity;
        await cartItem.save();
        res.status(200).json({message: 'Cart Update Succeffly', cartItem});
    } catch (error) {
        res.status(404).json({message: 'Internal server Error', error: error.message})
    }
});


// create the order 

export const createOrder = asyncHandler(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        totalPrice,
        totalPriceAfterDiscount,
        paymmentInfo,
    } = req.body;
    const { _id } = req.user;
    try {
        const order = await Order.create({                         // First we add the products details then we create order placed
            shippingInfo, 
            orderItems,
            totalPrice,
            totalPriceAfterDiscount,
            paymmentInfo,
            user: _id,
        });
        res.status(200).json({message: 'Order placed successfully', order})
    } catch (error) {
        res.status(400).json({message: 'Internal server Error', error: error.message})
        console.log('error: ', error.message)
    }
});

// Get My Orders - Retrieves all orders for the logged-in user
export const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;   
    try {
        const orders = await Order.find({ user: _id })
        .populate('user')
        .populate('orderItems.product')
        .populate('orderItems.color');
        res.status(200).json({message: 'My orders', orders});
    } catch (error) {
        // Handle any errors that occur during the database query
        res.status(404).json({message: 'Internal server error', error: error.message})
    }
});


// Get all Orders of user

export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        res.status(200).json({orders})
    } catch (error) {
        res.status(400).json({message:'Internal server error', error: error.message})
    }
});


// GET Single Order

export const getsingleOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await Order.findOne({ _id: id })
        .populate("user")
        .populate("orderItems.product")
        .populate("orderItems.color");
        res.status(200).json({message: 'Get Single Orders', orders})
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});

// Update the Order details

export const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await Order.findById(id);
        orders.orderStatus = req.body.status;
        await orders.save();
        res.status(200).json({message: 'Order status Update', orders});
    } catch (error) {
        res.status(400).json({message: 'Internal server error', error: error.message});
    }
});


// Get Month Wise Order Income

export const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
    let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "september",
        "October",
        "November",
        "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1);
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate),
                },
            },
        },
        {
        $group: {
        _id: {
            month: { $month: "$createdAt" },
        },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
         },
       },
    ]);
    res.status(200).json(data);
});


export const getYearlyTotalOrder = asyncHandler(async (req, res) => {
    let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "september",
        "October",
        "November",
        "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});
