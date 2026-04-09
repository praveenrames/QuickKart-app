import mongoose from "mongoose";

// Declare the Schema of the Mongo Model

let colorSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const color = mongoose.model('Color', colorSchema);

export default color;