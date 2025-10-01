import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from "cors";
import { auth } from "../src/lib/auth";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { PrismaClient } from '@prisma/client';

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.all("/api/auth/*", toNodeHandler(auth));

const prisma = new PrismaClient();

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers .jpg et .png sont autorisés'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use(express.json());

// Produits
app.get('/products', async (req, res) => {
    const products = await prisma.product.findMany({ include: { category: true } });
    res.json(products);
});

app.get("/api/products/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
        });
        if (!product) return res.status(404).json({ error: "Produit non trouvé" });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


app.post('/products', async (req, res) => {
    const { name, slug, description, price, stock, categoryId } = req.body;
    const product = await prisma.product.create({
        data: { name, slug, description, price, stock, images: [], categoryId }
    });
    res.json(product);
});

// Upload d'images pour un produit
app.post('/upload', upload.array('images', 5), async (req, res) => {
    if (!req.files) return res.status(400).send('Aucun fichier reçu');

    const files = req.files as Express.Multer.File[];
    const urls = files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);

    try {
        const product = await prisma.product.update({
            where: { id: Number(req.body.productId) },
            data: {
                images: {
                    push: urls
                }
            }
        });
        res.json({ success: true, urls, product });
    } catch (err) {
        res.status(400).json({ error: 'Produit introuvable ou erreur lors de la mise à jour' });
    }
});

// Catégories
app.get("/api/categories", async (req, res) => {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true },
    });
    res.json(categories);
});

app.get("/categories/first-product-by-categories", async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { id: "desc" },
  });

  res.json(categories);
})

app.get("/api/categories/:slug/products", async (req, res) => {
    const { slug } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: { products: true },
        });

        if (!category) {
            return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        res.json(category.products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo)' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Trop de fichiers envoyés' });
        }
        return res.status(400).json({ error: `Erreur d’upload: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ error: err.message || 'Erreur serveur' });
    }
    next();
});

app.listen(3001, () => console.log('API running on port 3001'));
