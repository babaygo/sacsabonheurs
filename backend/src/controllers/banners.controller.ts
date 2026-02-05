import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getBanners(req: Request, res: Response) {
    try {
        const banners = await prisma.banner.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
        res.json(banners);
    } catch (error) {
        console.error('Erreur récupération banners :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getAdminBanners(req: Request, res: Response) {
    try {
        const banners = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(banners);
    } catch (error) {
        console.error('Erreur récupération banners (admin):', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function createBanner(req: Request, res: Response) {
    try {
        const { message, variant, ctaLabel, ctaHref, dismissible, active } = req.body;
        if (!message) return res.status(400).json({ error: "Le champ 'message' est requis." });
        const isActive = active === 'true' || active === true;
        if (isActive) await prisma.banner.updateMany({ where: { active: true }, data: { active: false } });
        const banner = await prisma.banner.create({ data: {
            message,
            variant: variant || undefined,
            ctaLabel: ctaLabel || null,
            ctaHref: ctaHref || null,
            dismissible: dismissible === 'true' || dismissible === true,
            active: isActive,
        }});
        res.status(201).json(banner);
    } catch (error) {
        console.error('Erreur création banner :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateBanner(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    try {
        const { message, variant, ctaLabel, ctaHref, dismissible, active } = req.body;
        const isActiveProvided = typeof active !== 'undefined';
        const isActive = isActiveProvided ? (active === 'true' || active === true) : undefined;
        if (isActive) await prisma.banner.updateMany({ where: { active: true, NOT: { id } }, data: { active: false } });
        const banner = await prisma.banner.update({ where: { id }, data: {
            message,
            variant: variant || undefined,
            ctaLabel: ctaLabel || null,
            ctaHref: ctaHref || null,
            dismissible: typeof dismissible !== 'undefined' ? (dismissible === 'true' || dismissible === true) : undefined,
            active: typeof isActive !== 'undefined' ? isActive : undefined,
        }});
        res.json({ success: true, banner });
    } catch (error: any) {
        console.error('Erreur mise à jour banner :', error);
        if (error.code === 'P2025') return res.status(404).json({ error: 'Banner introuvable' });
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function deleteBanner(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    try {
        const banner = await prisma.banner.findUnique({ where: { id } });
        if (!banner) return res.status(404).json({ error: 'Bannière introuvable' });
        await prisma.banner.delete({ where: { id } });
        res.json({ message: 'Bannière supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression bannière :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
