import express from 'express';
import { webhookHandler } from '../controllers/webhook.controller.js';

const router = express.Router();

// Note: the raw body middleware is applied in index.ts; here we just expose the path
router.post('/webhook', webhookHandler);

export default router;
