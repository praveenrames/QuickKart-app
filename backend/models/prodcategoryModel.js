import mongoose from 'mongoose';

// Declare the Schema of the Mongo model

const prodcategorySchema = new mongoose.Schema(
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

const prodcategory = mongoose.model('PCategory', prodcategorySchema);

export default prodcategory;