import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToR2, deleteImagesFromR2 } from '../lib/bucket.js';

export async function getCollections(req: Request, res: Response) {
    try {
        const collections = await prisma.collection.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(collections);
    } catch (error) {
        console.error('Erreur récupération collections:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getFeaturedCollections(req: Request, res: Response) {
    try {
        const collections = await prisma.collection.findMany({
            where: { featured: true },
            orderBy: { order: 'asc' },
            take: 3,
        });
        res.json(collections);
    } catch (error) {
        console.error('Erreur récupération collections mises en avant:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getCollectionBySlug(req: Request, res: Response) {
    try {
        const collection = await prisma.collection.findUnique({
            where: { slug: req.params.slug },
            include: { products: { where: { hidden: false }, orderBy: { createdAt: 'desc' } } },
        });
        if (!collection) return res.status(404).json({ error: 'Collection non trouvée' });
        res.json(collection);
    } catch (error) {
        console.error('Erreur récupération collection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function createCollection(req: Request, res: Response) {
    try {
        const {
            slug, title, subtitle, material, excerpt,
            description, characteristics,
            metaTitle, metaDescription,
            featured, order,
        } = req.body;

        const existing = await prisma.collection.findUnique({ where: { slug } });
        if (existing) return res.status(400).json({ error: 'Ce slug existe déjà' });

        let heroImage: string | null = null;
        if (req.file) heroImage = await uploadToR2(req.file, 'images-collections');

        if (featured === 'true' || featured === true) {
            const featuredCount = await prisma.collection.count({ where: { featured: true } });
            if (featuredCount >= 3) {
                return res.status(400).json({ error: 'Il ne peut y avoir que 3 collections mises en avant.' });
            }
        }

        const collection = await prisma.collection.create({
            data: {
                slug,
                title,
                subtitle,
                heroImage,
                material,
                excerpt,
                description: JSON.parse(description),
                characteristics: JSON.parse(characteristics),
                metaTitle,
                metaDescription,
                featured: featured === 'true' || featured === true,
                order: parseInt(order) || 0,
            },
        });

        res.status(201).json(collection);
    } catch (error) {
        console.error('Erreur création collection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateCollection(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const {
            slug, title, subtitle, material, excerpt,
            description, characteristics,
            metaTitle, metaDescription,
            featured, order, removeImage,
        } = req.body;

        const current = await prisma.collection.findUnique({ where: { id } });
        if (!current) return res.status(404).json({ error: 'Collection non trouvée' });

        if (slug && slug !== current.slug) {
            const existing = await prisma.collection.findUnique({ where: { slug } });
            if (existing) return res.status(400).json({ error: 'Ce slug existe déjà' });
        }

        if ((featured === 'true' || featured === true) && !current.featured) {
            const featuredCount = await prisma.collection.count({ where: { featured: true } });
            if (featuredCount >= 3) {
                return res.status(400).json({ error: 'Il ne peut y avoir que 3 collections mises en avant.' });
            }
        }

        let heroImage: string | undefined = undefined;
        if (req.file) {
            heroImage = await uploadToR2(req.file, 'images-collections');
        }

        if ((removeImage === 'true' || !!req.file) && current.heroImage) {
            try { await deleteImagesFromR2([current.heroImage]); } catch (err) { console.warn('Erreur suppression image:', err); }
        }

        const collection = await prisma.collection.update({
            where: { id },
            data: {
                ...(slug && { slug }),
                ...(title && { title }),
                ...(subtitle && { subtitle }),
                ...(heroImage && { heroImage }),
                ...(removeImage === 'true' && !heroImage && { heroImage: null }),
                ...(material && { material }),
                ...(excerpt && { excerpt }),
                ...(description && { description: JSON.parse(description) }),
                ...(characteristics && { characteristics: JSON.parse(characteristics) }),
                ...(metaTitle && { metaTitle }),
                ...(metaDescription && { metaDescription }),
                ...(featured !== undefined && { featured: featured === 'true' || featured === true }),
                ...(order !== undefined && { order: parseInt(order) }),
            },
        });

        res.json(collection);
    } catch (error) {
        console.error('Erreur modification collection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function setCollectionProducts(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const productIds: number[] = req.body.productIds ?? [];

        if (!Array.isArray(productIds) || productIds.some((p) => typeof p !== 'number')) {
            return res.status(400).json({ error: 'productIds doit être un tableau de nombres' });
        }

        const collection = await prisma.collection.findUnique({ where: { id } });
        if (!collection) return res.status(404).json({ error: 'Collection non trouvée' });

        // Retirer les produits qui ne sont plus dans la liste
        await prisma.product.updateMany({
            where: { collectionId: id, id: { notIn: productIds } },
            data: { collectionId: null },
        });

        // Assigner les nouveaux produits
        if (productIds.length > 0) {
            await prisma.product.updateMany({
                where: { id: { in: productIds } },
                data: { collectionId: id },
            });
        }

        const updated = await prisma.collection.findUnique({
            where: { id },
            include: { products: { orderBy: { createdAt: 'desc' } } },
        });

        res.json(updated);
    } catch (error) {
        console.error('Erreur mise à jour produits collection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function deleteCollection(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const collection = await prisma.collection.findUnique({ where: { id } });
        if (!collection) return res.status(404).json({ error: 'Collection non trouvée' });
        if (collection.heroImage) {
            try { await deleteImagesFromR2([collection.heroImage]); } catch (err) { console.warn('Erreur suppression image:', err); }
        }
        await prisma.collection.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur suppression collection:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
