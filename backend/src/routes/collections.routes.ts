import express from 'express';
import multer from 'multer';
import {
    getCollections,
    getFeaturedCollections,
    getCollectionBySlug,
    createCollection,
    updateCollection,
    deleteCollection,
} from '../controllers/collections.controller.js';
import { requireAuth, requireAdmin } from '../middleware/middleware.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 7 * 1024 * 1024 } });

router.get('/collections', getCollections);
router.get('/collections/featured', getFeaturedCollections);
router.get('/collections/:slug', getCollectionBySlug);

router.post('/admin/collections', requireAuth, requireAdmin, upload.single('heroImage'), createCollection);
router.put('/admin/collections/:id', requireAuth, requireAdmin, upload.single('heroImage'), updateCollection);
router.delete('/admin/collections/:id', requireAuth, requireAdmin, deleteCollection);

export default router;
