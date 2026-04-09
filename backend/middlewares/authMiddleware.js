import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];

        try {
           if (token) {
              const decoded = jwt.verify(token, process.env.JWT_SECRET);
              const user = await User.findById(decoded?.id);
              req.user = user;
              next();
           } 
        } catch (error) {
            return res.status(401).json({message: 'Not Authorized user'})
        }
    } else {
        return res.status(404).json({message: 'There is no token atteched in the header'})
    }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({email});

    if (adminUser.role !== 'admin') {
        res.status(403).json({message: "Your Not Admin user"})
    } else {
        next();
    }
});
