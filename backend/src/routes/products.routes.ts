import express from 'express';
import multer from 'multer';
import {
    getProducts,
    getAdminProductById,
    getProductBySlug,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/products.controller.js';
import { requireAdmin, requireAuth } from '../middleware/middleware.js';

const router = express.Router();

const upload = multer({
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Seuls les fichiers .jpg et .png sont autorisés'));
    },
    limits: { fileSize: 7 * 1024 * 1024 }
});

// Public
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/products/category/:categoryId', getProductsByCategory);

// Admin
router.get('/admin/products/:id', requireAuth, requireAdmin, getAdminProductById);
router.post('/admin/products', requireAuth, requireAdmin, upload.array('images', 7), createProduct);
router.put('/admin/products/:id', requireAuth, requireAdmin, upload.array('images', 7), updateProduct);
router.delete('/admin/products/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
