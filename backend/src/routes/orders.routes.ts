import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/middleware.js';
import {
    checkout,
    getOrderBySessionId,
    getOrder,
    getUserOrders,
    attachRelayToOrder,
    getAdminOrders,
    updateOrderStatus,
    getAdminOrderById,
} from '../controllers/orders.controller.js';

const router = express.Router();

router.post('/checkout', requireAuth, checkout);
router.get('/order-by-session-id', requireAuth, getOrderBySessionId);
router.get('/order/:id', requireAuth, getOrder);
router.get('/orders', requireAuth, getUserOrders);
router.post('/order/:sessionId/relay', requireAuth, attachRelayToOrder);

// Admin
router.get('/admin/orders', requireAuth, requireAdmin, getAdminOrders);
router.put('/admin/orders/:orderId/status', requireAuth, requireAdmin, updateOrderStatus);
router.get('/admin/order/:id', requireAuth, requireAdmin, getAdminOrderById);

export default router;
