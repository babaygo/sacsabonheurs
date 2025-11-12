import { Product } from "@/types/Product";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getProducts(
    limit?: number,
    visibleOnly?: boolean
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        if (limit) params.append("limit", String(limit));
        if (visibleOnly) params.append("visibleOnly", "true");

        const res = await fetch(`${getBaseUrl()}/api/products?${params.toString()}`, {
            credentials: "include",
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        return data.products || [];
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

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products/category/${categoryId}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return [];
        }

        return await res.json();
    } catch (err: any) {
        return [];
    }
}