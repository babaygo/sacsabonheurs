import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from "cors";
import { auth } from "../src/lib/auth";
import { toNodeHandler } from "better-auth/node";
import { PrismaClient } from '@prisma/client';
import Stripe from "stripe";
import { requireAuth } from './middleware/requireAuth';

declare global {
    namespace Express {
        interface Request {
            user: {
                name: string,
                email: string,
                emailVerified: boolean,
                image: string | null
                createdAt: Date
                updatedAt: Date
                id: string
            },
        }
    }
}

const app = express();

app.use(cors({
    origin: process.env.URL_FRONT,
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"]!;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error("Webhook signature error:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        await prisma.order.create({
            data: {
                stripeSessionId: session.id,
                email: session.customer_email ?? '',
                userId: session.metadata!.userId,
                total: (session.amount_total ?? 0) / 100,
                items: {
                    create: lineItems.data.map((item) => ({
                        name: item.description ?? 'Unknown item',
                        price: (item.amount_total ?? 0) / 100,
                        quantity: item.quantity ?? 1,
                    })),
                },
            },
        });
    }

    res.status(200).json({ received: true });
});

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


app.post('/add-products', requireAuth, async (req, res) => {
    const { name, slug, description, price, stock, categoryId } = req.body;
    const product = await prisma.product.create({
        data: { name, slug, description, price, stock, images: [], categoryId }
    });
    res.json(product);
});

// Upload d'images pour un produit
app.post('/upload', requireAuth, upload.array('images', 5), async (req, res) => {
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

// Checkout with Stripe
app.post("/api/checkout", requireAuth, async (req, res) => {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: req.user.email,
        metadata: { userId: req.user.id },
        line_items: items.map((item: any) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })),
        success_url: process.env.URL_FRONT + "/orders?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: process.env.URL_FRONT + "/",
    });

    res.json({ url: session.url });
});

// Commandes
app.get("/api/order-by-session-id", requireAuth, async (req, res) => {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
        return res.status(400).json({ error: "Missing session_id" });
    }

    try {
        const order = await prisma.order.findFirst({
            where: { stripeSessionId: sessionId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (err) {
        console.error("Erreur lors de la récupération de la commande :", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/orders", requireAuth, async (req, res) => {
    const user = (req as any).user;

    try {
        const orders = await prisma.order.findMany({
            where: { email: user.email },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(orders);
    } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(3001, () => console.log('API running on port 3001'));
