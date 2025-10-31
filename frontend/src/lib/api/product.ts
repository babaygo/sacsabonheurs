import { Product } from "@/types/Product";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`, {
            cache: "no-store"
        });

        if (!res.ok) {
            console.error("Erreur API produits :", res.status, await res.text());
            return [];
        }
        return await res.json();
    } catch (error: any) {
        console.error("Erreur getProducts:", error);
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`Erreur API produit ${slug} :`, res.status, await res.text());
            return null;
        }

        return await res.json();
    } catch (err: any) {
        console.error(`Erreur réseau produit ${slug} :`, err.message);
        return null;
    }
}