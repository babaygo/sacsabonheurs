import express from 'express';
import { contactHandler } from '../controllers/contact.controller.js';
import { requireAuth } from '../middleware/middleware.js';

const router = express.Router();

router.post('/contact', requireAuth, contactHandler);

export default router;
