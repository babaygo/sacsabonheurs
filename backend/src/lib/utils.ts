import { prisma } from "./prisma";

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
