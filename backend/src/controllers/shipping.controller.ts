import { Request, Response } from 'express';
import { createStripeShippingRate, fetchStripeShippingRates, updateShippingRate, archiveShippingRate } from '../lib/stripe.js';

export async function listShippingRates(req: Request, res: Response) {
    try {
        const shippings_rates = await fetchStripeShippingRates();
        res.json(shippings_rates);
    } catch (error: any) {
        console.error('Erreur lors de la récupération des shippings rates :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function createShippingRate(req: Request, res: Response) {
    try {
        if (!req.body.display_name || !req.body.amount) return res.status(400).json({ error: 'Nom et montant requis' });
        await createStripeShippingRate(req.body);
        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Erreur création shipping rate :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateShippingRateHandler(req: Request, res: Response) {
    try {
        const shippingRateId = req.params.id;
        const { metadata, active } = req.body;
        if (active === false) await archiveShippingRate(shippingRateId, active);
        else await updateShippingRate(shippingRateId, metadata);
        res.json({ success: true });
    } catch (error: any) {
        console.error('Erreur modification shipping rate :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
