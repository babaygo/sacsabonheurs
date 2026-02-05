import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

import productsRouter from './routes/products.routes.js';
import categoriesRouter from './routes/categories.routes.js';
import bannersRouter from './routes/banners.routes.js';
import articlesRouter from './routes/articles.routes.js';
import ordersRouter from './routes/orders.routes.js';
import shippingRouter from './routes/shipping.routes.js';
import contactRouter from './routes/contact.routes.js';
import legalRouter from './routes/legal.routes.js';
import googleRouter from './routes/google.routes.js';
import { webhookHandler } from './controllers/webhook.controller.js';

const app = express();

app.use(cors({ origin: process.env.URL_FRONT, credentials: true }));

app.all('/api/auth/*', toNodeHandler(auth.handler));

app.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json());

app.use('/api', productsRouter);
app.use('/api', categoriesRouter);
app.use('/api', bannersRouter);
app.use('/api', articlesRouter);
app.use('/api', ordersRouter);
app.use('/api', shippingRouter);
app.use('/api', contactRouter);
app.use('/api', legalRouter);
app.use('/api', googleRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err && err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo)' });
        if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: 'Trop de fichiers envoyés' });
        return res.status(400).json({ error: `Erreur d'upload: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ error: err.message || 'Erreur serveur' });
    }
    next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
