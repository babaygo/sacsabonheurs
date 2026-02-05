import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getLegal(req: Request, res: Response) {
    try {
        const legal = await prisma.legal.findUnique({ where: { id: 1 } });
        if (!legal) return res.status(404).json({ error: 'Contenu légal non trouvé.' });
        res.status(200).json(legal);
    } catch (error: any) {
        console.error('Erreur récupération du contenu légal :', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function upsertLegal(req: Request, res: Response) {
    try {
        const { mentions, cgv, privacy } = req.body;
        await prisma.legal.upsert({ where: { id: 1 }, update: { mentions, cgv, privacy }, create: { id: 1, mentions, cgv, privacy } });
        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Erreur dans l\'insertion des policies :', error.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
