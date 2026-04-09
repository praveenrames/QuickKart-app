import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import dbConnection from './config/dbConnection.js';
import bodyParser from 'body-parser';
import cors from 'cors'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// routings
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import ColorRouter from './routes/colorRoute.js';
import CategoryRouter from './routes/prodcategoryRoute.js';
import brandRouter from './routes/brandRoute.js';
import enquiryRouter from './routes/enqRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import couponRoute from './routes/couponRoute.js';
import blogRoute from './routes/blogRoute.js';
import blogCatRoute from './routes/blogCatRoute.js';



const app = express();
let PORT = process.env.PORT || 4000;
dbConnection();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('div'));
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/color', ColorRouter);
app.use('/api/category', CategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/enquiry', enquiryRouter);
app.use('/api/upload', uploadRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/blog', blogRoute);
app.use('/api/blogcat', blogCatRoute);


app.get('/', (req, res) => {
   return res.status(200).json({message: 'Welcom to app'})
})

app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`)
})