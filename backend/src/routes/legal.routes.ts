import express from 'express';
import { getLegal, upsertLegal } from '../controllers/legal.controller.js';
import { requireAuth, requireAdmin } from '../middleware/middleware.js';

const router = express.Router();

router.get('/admin/legal', getLegal);
router.post('/admin/legal', requireAuth, requireAdmin, upsertLegal);

export default router;
