import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = async () => {
    try {
        const dbConnect = await mongoose.connect(process.env.MongoDB_url);
        console.log('Database Connected Successfully');
        return dbConnect;
    } catch (error) {
        console.log(`Database Conncetion Error : ${error}`)
    }
}

export default dbConnection;