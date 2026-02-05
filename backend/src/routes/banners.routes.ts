import express from 'express';
import multer from 'multer';
import { getBanners, getAdminBanners, createBanner, updateBanner, deleteBanner } from '../controllers/banners.controller.js';
import { requireAuth, requireAdmin } from '../middleware/middleware.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 7 * 1024 * 1024 } });

router.get('/banners', getBanners);
router.get('/admin/banners', requireAuth, requireAdmin, getAdminBanners);
router.post('/admin/banners', requireAuth, requireAdmin, upload.none(), createBanner);
router.put('/admin/banners/:id', requireAuth, requireAdmin, upload.none(), updateBanner);
router.delete('/admin/banners/:id', requireAuth, requireAdmin, upload.none(), deleteBanner);

export default router;
