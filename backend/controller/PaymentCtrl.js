import Razorpay from "razorpay";
import dotenv from 'dotenv';
dotenv.config();


const instance = new Razorpay({
    key_id: process.env.Razorpay_KEY_ID,
    key_secret: process.env.Razorpay_KEY_SECRET,
})


// Checkout

export const checkout = async (req, res) => {
    const { amount } = req.body;
    
    const option = {
        amount: amount * 100,
        currency: "INR",
    };

    const order = await instance.orders.create(option);
    res.status(200).json({
        sucess: true,
        order,
    });
};

// Payment Verification

export const paymentVerification = async (req, res) => {
    const { razorpayOrderId, razorpaymentId } = req.body;

    res.status(200).json({
        razorpayOrderId,
        razorpaymentId,
    });
};

