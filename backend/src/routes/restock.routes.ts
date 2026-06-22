import express from 'express';
import { subscribeRestockAlert, getRestockAlerts } from '../controllers/restock.controller.js';
import { requireAuth, requireAdmin } from '../middleware/middleware.js';

const router = express.Router();

// Public : inscription à l'alerte de retour
router.post('/products/:slug/restock-alert', subscribeRestockAlert);

// Admin : liste des inscrits pour un produit
router.get('/admin/products/:id/restock-alerts', requireAuth, requireAdmin, getRestockAlerts);

export default router;
