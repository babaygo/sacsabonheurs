import express from 'express';
import multer from 'multer';
import { requireAdmin, requireAuth } from '../middleware/middleware.js';
import { listShippingRates, createShippingRate, updateShippingRateHandler } from '../controllers/shipping.controller.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 7 * 1024 * 1024 } });

router.get('/admin/shippings-rates', requireAuth, requireAdmin, upload.none(), listShippingRates);
router.post('/admin/shipping-rate', requireAuth, requireAdmin, upload.none(), createShippingRate);
router.put('/admin/shipping-rate/:id', requireAuth, requireAdmin, upload.none(), updateShippingRateHandler);

export default router;
