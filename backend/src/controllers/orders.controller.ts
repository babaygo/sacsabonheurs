import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { fetchStripeShippingRates, createCheckout, getLineItems, getDeliveryMode } from '../lib/stripe.js';
import { getImageUrl } from '../lib/utils.js';
import { sendEmail, sendOrderConfirmationEmail } from '../lib/email.js';

export async function checkout(req: Request, res: Response) {
    const { items } = req.body;
    const user: any = (req as any).user;
    const relay = (req as any)?.relay;
    const slugs = items.map((item: any) => item.slug);

    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { slug: item.slug } });
        if (!product || product.stock < item.quantity || product.hidden || item.quantity < 1) {
            return res.status(422).json({ error: `Le produit ${item.name} n'est plus disponible.` });
        }
    }

    const shippings_rates = await fetchStripeShippingRates();
    const shipping_options = shippings_rates.map(rate => ({ shipping_rate: rate.id }));

    const session = await createCheckout(user, shipping_options, relay, slugs, items);
    res.json({ url: session.url });
}

export async function getOrderBySessionId(req: Request, res: Response) {
    const sessionId = req.query.session_id as string;
    if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });
    try {
        const order = await prisma.order.findFirst({ where: { stripeSessionId: sessionId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Erreur lors de la récupération de la commande :', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getOrder(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    if (!orderId) return res.status(400).json({ error: 'Missing or invalid order_id' });
    try {
        const order = await prisma.order.findFirst({ where: { id: orderId }, include: { items: true } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Erreur lors de la récupération de la commande :', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getUserOrders(req: Request, res: Response) {
    const user = (req as any).user;
    try {
        const orders = await prisma.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: 'desc' } });
        res.json(orders);
    } catch (err) {
        console.error('Erreur lors de la récupération des commandes :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function attachRelayToOrder(req: Request, res: Response) {
    const relay = req.body.relay;
    const user = (req as any).user;
    const sessionId = req.params.sessionId as string;
    if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });
    try {
        await prisma.order.update({ where: { stripeSessionId: sessionId, userId: user.id }, data: {
            relayId: relay.ID,
            relayName: relay.Nom,
            relayAddress: relay.Adresse1,
            deliveryMethod: 'mondial_relay',
        }});

        const order = await prisma.order.findUnique({ where: { stripeSessionId: sessionId }, include: { user: true, items: true } });
        if (!order) return res.status(404).json({ error: 'Commande introuvable' });
        await sendOrderConfirmationEmail(order);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Erreur lors de la récupération de la commande :', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Admin
export async function getAdminOrders(req: Request, res: Response) {
    try {
        const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, items: true } });
        res.json(orders);
    } catch (error) {
        console.error('Erreur récupération commandes :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateOrderStatus(req: Request, res: Response) {
    const newStatus = req.body.status;
    const orderId = Number(req.params.orderId);
    if (!orderId) return res.status(400).json({ error: 'ID invalide' });
    try {
        const order = await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
        res.status(200).json({ success: true, order });
    } catch (error: any) {
        console.error('Erreur mise à jour commande :', error);
        if (error.code === 'P2025') return res.status(404).json({ error: 'Commande introuvable' });
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
}

export async function getAdminOrderById(req: Request, res: Response) {
    const orderId = Number(req.params.id);
    if (!orderId) return res.status(400).json({ error: 'Missing or invalid order_id' });
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true, items: { include: { product: true } } } });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Erreur lors de la récupération de la commande :', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
