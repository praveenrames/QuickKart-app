import express from 'express';
import {
    createEnquiry,
    deleteEnquiry,
    updateEnquiry,
    getEnquiryById,
    getAllEnquiries
} from '../controller/enqCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/createEnquiry', createEnquiry);
router.put('/updateEnquiry/:id', authMiddleware, isAdmin, updateEnquiry);
router.delete('/deleteEnquiry/:id', authMiddleware, isAdmin, deleteEnquiry);
router.get('/getEnquiry/:id', getEnquiryById);
router.get('/getAllEnquiries', getAllEnquiries);

export default router;