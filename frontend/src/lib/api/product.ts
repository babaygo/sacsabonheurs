import { Product } from "@/types/Product";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return [];
        }
        return await res.json();
    } catch (error: any) {
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return null;
        }

        return await res.json();
    } catch (err: any) {
        return null;
    }
}