import express from 'express';
import multer from 'multer';
import {
    getArticles,
    getArticleBySlug,
    getAdminArticles,
    createArticle,
    updateArticle,
    deleteArticle,
} from '../controllers/articles.controller.js';
import { requireAuth, requireAdmin } from '../middleware/middleware.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 7 * 1024 * 1024 } });

router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);

router.get('/admin/articles', requireAuth, requireAdmin, getAdminArticles);
router.post('/admin/articles', requireAuth, requireAdmin, upload.single('image'), createArticle);
router.put('/admin/articles/:id', requireAuth, requireAdmin, upload.single('image'), updateArticle);
router.delete('/admin/articles/:id', requireAuth, requireAdmin, deleteArticle);

export default router;
