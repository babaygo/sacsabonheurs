import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { uploadToR2, deleteImagesFromR2 } from '../lib/bucket.js';

export async function getArticles(req: Request, res: Response) {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limitParam = parseInt(req.query.limit as string) || 5;
        const limit = Math.min(30, Math.max(1, limitParam));
        const excludeSlug = (req.query.excludeSlug as string) || "";
        const skip = (page - 1) * limit;
        const whereClause = {
            published: true,
            ...(excludeSlug ? { slug: { not: excludeSlug } } : {}),
        };
        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.article.count({ where: whereClause }),
        ]);
        res.json({
            data: articles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Erreur récupération articles:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getArticleBySlug(req: Request, res: Response) {
    try {
        const article = await prisma.article.findUnique({ where: { slug: req.params.slug } });
        if (!article) return res.status(404).json({ error: 'Article non trouvé' });
        res.json(article);
    } catch (error: any) {
        console.error('Erreur récupération article:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function getAdminArticles(req: Request, res: Response) {
    try {
        const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(articles);
    } catch (error: any) {
        console.error('Erreur récupération articles admin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function createArticle(req: Request, res: Response) {
    try {
        const { title, slug, excerpt, content, author, category, keywords, metaDescription, readingTime, published } = req.body;

        const existingArticle = await prisma.article.findUnique({ where: { slug } });
        if (existingArticle) return res.status(400).json({ error: 'Ce slug existe déjà' });

        let imageUrl = null;
        if (req.file) imageUrl = await uploadToR2(req.file, 'images-articles-blog');

        const article = await prisma.article.create({ data: {
            title,
            slug,
            excerpt,
            content,
            image: imageUrl,
            author: author || 'Sacs à Bonheurs',
            category: category || 'Blog',
            keywords,
            metaDescription,
            readingTime: parseInt(readingTime) || 5,
            published: published === 'true' || false,
        }});

        res.status(201).json(article);
    } catch (error: any) {
        console.error('Erreur création article:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function updateArticle(req: Request, res: Response) {
    try {
        const { title, slug, excerpt, content, author, category, keywords, metaDescription, readingTime, published, removeImage } = req.body;

        const currentArticle = await prisma.article.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!currentArticle) return res.status(404).json({ error: 'Article non trouvé' });

        const existingArticle = await prisma.article.findUnique({ where: { slug } });
        if (existingArticle && existingArticle.id !== parseInt(req.params.id)) return res.status(400).json({ error: 'Ce slug existe déjà' });

        let imageUrl = undefined;
        if (req.file) imageUrl = await uploadToR2(req.file, 'images-articles-blog');

        const shouldRemoveImage = removeImage === 'true' || !!req.file;
        if (shouldRemoveImage && currentArticle.image) {
            try {
                await deleteImagesFromR2([currentArticle.image]);
            } catch (err) {
                console.warn('Erreur suppression image:', err);
            }
        }

        const article = await prisma.article.update({ where: { id: parseInt(req.params.id) }, data: {
            ...(title && { title }),
            ...(slug && { slug }),
            ...(excerpt && { excerpt }),
            ...(content && { content }),
            ...(imageUrl && { image: imageUrl }),
            ...(removeImage === 'true' && !imageUrl && { image: null }),
            ...(author && { author }),
            ...(category && { category }),
            ...(keywords && { keywords }),
            ...(metaDescription && { metaDescription }),
            ...(readingTime && { readingTime: parseInt(readingTime) }),
            ...(published !== undefined && { published: published === 'true' }),
        }});

        res.json(article);
    } catch (error: any) {
        console.error('Erreur modification article:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function deleteArticle(req: Request, res: Response) {
    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!article) return res.status(404).json({ error: 'Article non trouvé' });
        if (article.image) {
            try { await deleteImagesFromR2([article.image]); } catch (err) { console.warn('Erreur suppression image:', err); }
        }
        await prisma.article.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error: any) {
        console.error('Erreur suppression article:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
