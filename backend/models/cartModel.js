import mongoose from 'mongoose';

// Declare the Schema of the Mongo model

var cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Color",
        },
    },
    {
        timestamps: true,
    }
);

const cart = mongoose.model("Cart", cartSchema);

export default cart;