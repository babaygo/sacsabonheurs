import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { IncomingHttpHeaders } from "http";

export async function getImageUrl(slug: string): Promise<string> {
    const product = await prisma.product.findUnique({
        where: { slug },
        select: { images: true },
    });

    const images = product?.images;

    if (Array.isArray(images) && typeof images[0] === "string") {
        return images[0];
    }

    return '';
}

export async function getUser(headers: IncomingHttpHeaders): Promise<any> {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(headers),
        });

        if (!session || !session.user) {
            return null;
        }

        return session.user;
    } catch (err: any) {
        console.error("Erreur dans getUser()", err)
        return null
    }
}