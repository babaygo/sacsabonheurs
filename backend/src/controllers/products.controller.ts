import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToR2, cfImageUrl, deleteImagesFromR2 } from '../lib/bucket.js';

export async function getProducts(req: Request, res: Response) {
    try {
        const user = await (await import('../lib/utils.js')).getUser(req.headers);
        const isAdmin = user?.role === 'admin';
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 24;
        const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
        const visibleOnly = req.query.visibleOnly === 'true';
        const where = isAdmin && !visibleOnly ? {} : { hidden: false };

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        const totalCount = await prisma.product.count({ where });
        const hasMore = skip + limit < totalCount;

        res.json({ products, hasMore });
    } catch (error) {
        console.error('Erreur récupération produits :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getAdminProductById(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
        const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
        if (!product) return res.status(404).json({ error: 'Produit introuvable' });
        res.json(product);
    } catch (error) {
        console.error('Erreur récupération produit :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getProductBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    try {
        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getProductsByCategory(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    try {
        const products = await prisma.product.findMany({ where: { categoryId }, include: { category: true } });
        if (!products) return res.status(404).json({ error: 'Produits non trouvés' });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const {
            name, slug, description, price, categoryId,
            stock, weight, height, lenght, width, hidden, color, material
        } = req.body;

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Aucune image reçue.' });
        }

        const urls = await Promise.all(files.map(file => uploadToR2(file)));
        const cfUrls = urls.map(url => cfImageUrl(url));

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                weight: parseFloat(weight),
                height: parseFloat(height),
                lenght: parseFloat(lenght),
                width: parseFloat(width),
                categoryId: parseInt(categoryId),
                images: cfUrls,
                hidden: hidden === 'true',
                color,
                material,
                isOnSale: false,
                salePrice: null,
                salePercentage: null
            },
        });

        res.json(product);
    } catch (error: any) {
        console.error('Erreur création produit :', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Le nom du produit est déjà utilisé." });
        }
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const {
        name, slug, description, price, stock,
        weight, height, lenght, width, categoryId, hidden, color, material,
        isOnSale, salePrice, salePercentage
    } = req.body;

    try {
        if (req.body.removedImages) {
            Array.isArray(req.body.removedImages)
                ? await deleteImagesFromR2(req.body.removedImages)
                : await deleteImagesFromR2([req.body.removedImages]);
        }

        const keptImages = req.body.keptImages
            ? Array.isArray(req.body.keptImages)
                ? req.body.keptImages
                : [req.body.keptImages]
            : [];

        const uploaded = req.files && Array.isArray(req.files)
            ? await Promise.all((req.files as Express.Multer.File[]).map(file => uploadToR2(file)))
            : [];

        const cfUploaded = uploaded.map(url => cfImageUrl(url));
        const cfKept = keptImages.map((url: string) => cfImageUrl(url));

        const finalImages = [...cfKept, ...cfUploaded].slice(0, 7);

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                weight: parseFloat(weight),
                height: parseFloat(height),
                lenght: parseFloat(lenght),
                width: parseFloat(width),
                categoryId: parseInt(categoryId),
                images: finalImages,
                hidden: hidden === 'true' ? true : false,
                color,
                material,
                isOnSale: isOnSale === 'true',
                salePrice: salePrice ? parseFloat(salePrice) : null,
                salePercentage: salePercentage ? parseFloat(salePercentage) : null
            },
        });

        res.json({ success: true, product });
    } catch (error) {
        console.error('Erreur mise à jour produit :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ error: 'Produit introuvable' });

        await deleteImagesFromR2(product.images);
        await prisma.product.delete({ where: { id } });

        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression produit :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
