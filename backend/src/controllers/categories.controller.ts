import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getCategories(req: Request, res: Response) {
    try {
        const categories = await prisma.category.findMany({ include: { products: true } });
        res.json(categories);
    } catch (error) {
        console.error('Erreur récupération catégories :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function createCategory(req: Request, res: Response) {
    try {
        const { name, slug } = req.body;
        const category = await prisma.category.create({ data: { name, slug } });
        res.json(category);
    } catch (error: any) {
        console.error('Erreur création catégorie :', error);
        if (error.code === 'P2002') return res.status(400).json({ error: "Le nom de cette catégorie est déjà utilisée." });
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name, slug } = req.body;
    try {
        const category = await prisma.category.update({ where: { id: parseInt(id) }, data: { name, slug } });
        res.json({ success: true, category });
    } catch (error) {
        console.error('Erreur mise à jour catégorie :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function deleteCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    try {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) return res.status(404).json({ error: 'Catégorie introuvable' });
        await prisma.product.deleteMany({ where: { categoryId: id } });
        await prisma.category.delete({ where: { id } });
        res.json({ message: 'Catégorie supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression catégorie :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
