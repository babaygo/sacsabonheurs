import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const app = express();
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

app.get('/products', async (req, res) => {
    const products = await prisma.product.findMany({ include: { category: true } });
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID invalide' });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!product) {
            return res.status(404).json({ error: 'Produit introuvable' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


app.post('/products', async (req, res) => {
    const { name, slug, description, price, stock, categoryId } = req.body;
    const product = await prisma.product.create({
        data: { name, slug, description, price, stock, images: [], categoryId }
    });
    res.json(product);
});

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
