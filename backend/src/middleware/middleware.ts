import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { NextFunction, Request, Response } from "express";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session || !session.user) {
            return res.status(401).json({ error: "Non authentifié" });
        }

        (req as any).user = session.user;
        next();

    } catch (err) {
        console.error("Erreur auth middleware :", err);
        res.status(401).json({ error: "Erreur d’authentification" });
    }
}