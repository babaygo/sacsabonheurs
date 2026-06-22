import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { sendRestockSubscriptionEmail } from '../lib/email.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public : un visiteur s'inscrit pour être prévenu du retour en ligne d'un produit
 * actuellement « indisponible » (exposé en physique). Idempotent : une ré-inscription
 * réactive simplement l'alerte.
 */
export async function subscribeRestockAlert(req: Request, res: Response) {
    const { slug } = req.params;
    const email = String(req.body?.email ?? '').trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    try {
        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
        if (!product.unavailable) {
            return res.status(422).json({ error: 'Ce produit est déjà disponible à l\'achat.' });
        }

        await prisma.restockAlert.upsert({
            where: { productId_email: { productId: product.id, email } },
            update: { notified: false },
            create: { productId: product.id, email },
        });

        // L'envoi de l'email ne doit jamais faire échouer l'inscription.
        await sendRestockSubscriptionEmail(email, product).catch((e) =>
            console.error('Erreur email confirmation alerte :', e)
        );

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Erreur inscription alerte de retour :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

/**
 * Admin : liste des inscrits à l'alerte de retour pour un produit donné.
 */
export async function getRestockAlerts(req: Request, res: Response) {
    const productId = Number(req.params.id);
    if (isNaN(productId)) return res.status(400).json({ error: 'ID invalide' });

    try {
        const alerts = await prisma.restockAlert.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            select: { id: true, email: true, notified: true, createdAt: true },
        });

        res.json({
            alerts,
            total: alerts.length,
            pending: alerts.filter((a) => !a.notified).length,
        });
    } catch (error) {
        console.error('Erreur récupération alertes de retour :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
