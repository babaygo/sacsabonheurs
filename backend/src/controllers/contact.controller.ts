import { Request, Response } from 'express';
import { sendContactConfirmationEmail } from '../lib/email.js';

export async function contactHandler(req: Request, res: Response) {
    try {
        const { name, email, order, message } = req.body;
        if (!name || !email || !message) return res.status(400).json({ error: 'Champs requis manquants.' });
        await sendContactConfirmationEmail(email, name, order, message);
        res.status(201).json({ success: true });
    } catch (error: any) {
        console.error('Erreur envoi mail:', error);
        res.status(500).json({ error: "Erreur lors de l'envoi du message." });
    }
}
