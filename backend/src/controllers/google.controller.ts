import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { generateProductFeed } from '../lib/google-merchant.js';

export async function googleMerchantFeed(req: Request, res: Response) {
    try {
        const products = await prisma.product.findMany({ where: { hidden: false } });
        const xml = generateProductFeed(products, { baseUrl: process.env.URL_FRONT!, brandName: 'Sacs à Bonheurs' });
        res.set('Content-Type', 'application/xml; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=3600');
        res.send(xml);
    } catch (error) {
        console.error('Erreur génération flux Google Merchant:', error);
        res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Erreur serveur</error>');
    }
}
