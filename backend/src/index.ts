import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { PrismaClient, User } from '@prisma/client';
import Stripe from "stripe";
import { requireAuth } from './middleware/middleware';
import { sendOrderConfirmationEmail } from './lib/email';
import { getImageUrl } from './lib/utils';
import { auth } from './lib/auth';
import { deleteImagesFromR2, s3, uploadToR2 } from './lib/bucket';

const app = express();

app.use(cors({
    origin: process.env.URL_FRONT,
    credentials: true,
}));

app.all("/api/auth/*", toNodeHandler(auth));

const prisma = new PrismaClient();

const upload = multer({
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
        const slugs: string[] = JSON.parse(session.metadata!.slugs);
        const billingAddress = session.customer_details?.address;

        const items = await Promise.all(
            lineItems.data.map(async (item, index) => ({
                name: item.description ?? "Produit inconnu",
                price: item.amount_total ? item.amount_total / 100 : 0,
                quantity: item.quantity ?? 1,
                imageUrl: await getImageUrl(slugs[index]),
            }))
        );

        try {
            await prisma.order.create({
                data: {
                    stripeSessionId: session.id,
                    user: { connect: { id: session.metadata!.userId } },
                    email: session.customer_email!,
                    total: session.amount_total! / 100,
                    subtotal: session.amount_subtotal! / 100,
                    shippingCost: session.total_details?.amount_shipping! / 100,
                    taxes: session.total_details?.amount_tax,
                    deliveryMethod: session.metadata?.deliveryMethod ?? null,
                    relayId: session.metadata?.relayId ?? null,
                    relayName: session.metadata?.relayName ?? null,
                    relayAddress: session.metadata?.relayAddress ?? null,
                    billingAddress: billingAddress?.line1 ?? null,
                    detailsBillingAddress: billingAddress?.line2 ?? null,
                    postalCode: billingAddress?.postal_code ?? null,
                    city: billingAddress?.city ?? null,
                    country: billingAddress?.country ?? "FR",
                    items: { create: items },
                },
            });
        } catch (error: any) {
            console.error("Erreur sur la création d'une commande :", error);
        }
    }
    res.status(200).json({ received: true });
});

app.use(express.json());

// Produits
app.get("/api/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(products);
    } catch (error) {
        console.error("Erreur récupération produits :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get("/api/admin/products/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) return res.status(404).json({ error: "Produit introuvable" });

        res.json(product);
    } catch (error) {
        console.error("Erreur récupération produit :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
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

// Catégories
app.get("/api/categories", async (req, res) => {
    const categories = await prisma.category.findMany({
        select: { id: true, name: true, slug: true },
    });
    res.json(categories);
});

app.get("/api/categories/first-product-by-category", async (req, res) => {
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
            where: { slug: slug },
            include: { products: true },
        });

        if (!category) {
            return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        if (!category.products.length) {
            return res.status(204).json({ message: "Aucun produit dans cette catégorie" });
        }

        res.json(category.products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
    const user: User = (req as any).user;
    const relay = (req as any)?.relay
    const slugs = items.map((item: any) => item.slug);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: 'required',
        mode: "payment",
        customer_email: user.email,
        automatic_tax: { enabled: true },
        shipping_options: [{
            shipping_rate: process.env.ID_TARIF_LIVRAISON
        }],
        metadata: {
            userId: user.id,
            deliveryMethod: "mondial_relay",
            relayId: relay?.id,
            relayName: relay?.name,
            relayAddress: relay?.address,
            slugs: JSON.stringify(slugs)
        },
        line_items: items.map((item: any) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })),
        success_url: process.env.URL_FRONT + "/choose-relay?session_id={CHECKOUT_SESSION_ID}",
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
            where: { userId: user.id },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });

        res.json(orders);
    } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/api/order/:id/relay", requireAuth, async (req, res) => {
    const relay = req.body.relay
    const user = (req as any).user;
    const sessionId = req.params.id as string;

    if (!sessionId) {
        return res.status(400).json({ error: "Missing session_id" });
    }

    try {
        await prisma.order.update({
            where: { stripeSessionId: sessionId, userId: user.id },
            data: {
                relayId: relay.ID,
                relayName: relay.Nom,
                relayAddress: relay.Adresse1,
                deliveryMethod: "mondial_relay",
            }
        });

        const order = await prisma.order.findUnique({
            where: { stripeSessionId: sessionId },
            include: {
                user: true,
                items: true,
            },
        });

        if (!order) {
            return res.status(404).json({ error: "Commande introuvable" });
        }

        await sendOrderConfirmationEmail(order);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erreur lors de la récupération de la commande :", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Admin routes
app.get("/api/admin/orders", requireAuth, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                items: true,
            },
        });

        res.json(orders);
    } catch (error) {
        console.error("Erreur récupération commandes :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/api/admin/orders/:orderId/status", requireAuth, async (req, res) => {
    const newStatus = req.body.status
    const orderId = Number(req.params.orderId);

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
        });

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur", details: error });
    }
})

app.get("/api/admin/orders/:id", requireAuth, async (req, res) => {
    const orderId = Number(req.params.id);
    if (!Number.isFinite(orderId)) return res.status(400).json({ error: "ID invalide" });

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                items: true,
            },
        });
        if (!order) return res.status(404).json({ error: "Commande introuvable" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur", details: error });
    }
});

app.post("/api/admin/products", requireAuth, upload.array("images", 5), async (req, res) => {
    try {
        const {
            name, slug, description, price, categoryId,
            stock, weight, height, lenght, width
        } = req.body;

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Aucune image reçue." });
        }

        const urls = await Promise.all(files.map(file => uploadToR2(file)));

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
                images: urls,
            },
        });

        res.json(product);
    } catch (error: any) {
        console.error("Erreur création produit :", error);

        if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
            return res.status(400).json({ error: "Ce slug est déjà utilisé." });
        }

        res.status(500).json({ error: "Erreur serveur" });
    }
});


app.put("/api/admin/products/:id", requireAuth, upload.array("images", 5), async (req, res) => {
    const { id } = req.params;
    const {
        name, slug, description, price, stock,
        weight, height, lenght, width, categoryId, keptImages
    } = req.body;

    try {
        const parsedImages: string[] = keptImages || "[]";

        const uploaded = req.files && Array.isArray(req.files)
            ? await Promise.all((req.files as Express.Multer.File[]).map(file => uploadToR2(file)))
            : [];

        const finalImages = [...parsedImages, ...uploaded].slice(0, 5);

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
            },
        });

        res.json({ success: true, product });
    } catch (error) {
        console.error("Erreur mise à jour produit :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.delete("/api/admin/products/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    try {
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return res.status(404).json({ error: "Produit introuvable" });
        }

        await deleteImagesFromR2(product.images);
        await prisma.product.delete({ where: { id } });

        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        console.error("Erreur suppression produit :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.delete("/api/admin/products/images/:url", requireAuth, async (req, res) => {
    const url = req.params.url;
    try {
        await deleteImagesFromR2([url]);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erreur suppression R2 :", err);
        res.status(500).json({ error: "Erreur suppression image" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
