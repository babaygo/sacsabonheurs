import express from 'express';
import { googleMerchantFeed } from '../controllers/google.controller.js';

const router = express.Router();

router.get('/google-merchant-feed.xml', googleMerchantFeed);

export default router;
