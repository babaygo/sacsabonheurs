import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller.js';
import { requireAdmin, requireAuth } from '../middleware/middleware.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({ limits: { fileSize: 7 * 1024 * 1024 } });

router.get('/categories', getCategories);

router.post('/admin/categories', requireAuth, requireAdmin, upload.none(), createCategory);
router.put('/admin/categories/:id', requireAuth, requireAdmin, upload.none(), updateCategory);
router.delete('/admin/categories/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
