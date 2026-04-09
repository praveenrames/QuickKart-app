import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storge = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/"));
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format "}, false);
    }
};

export const uploadPhoto = multer({
    storage: storge,
    fileFilter: multerFilter,
    limits: { fileSize: 10000000 },
});

export const productImagResize = async (req, res, next) => {
    if (!req.files) return next();
    
    const productsDir = path.join(__dirname, '../public/images/products');
    if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
    }
    
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(productsDir, file.filename));
            
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('Error deleting temp file:', err);
            }
        })
    );
    next();
};


export const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    
    const blogsDir = path.join(__dirname, '../public/images/blogs');
    if (!fs.existsSync(blogsDir)) {
        fs.mkdirSync(blogsDir, { recursive: true });
    }
    
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
             .resize(300, 300)
             .toFormat("jpeg")
             .jpeg({ quality: 90 })
             .toFile(path.join(blogsDir, file.filename));
             
             try {
                 fs.unlinkSync(file.path);
             } catch (err) {
                 console.error('Error deleting temp file:', err);
             }
        })
    );
    next();
}


