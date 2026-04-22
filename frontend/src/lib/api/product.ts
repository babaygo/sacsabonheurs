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

export async function getProductsByCategorySlug(slug: string, limit = 24): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        params.append("limit", String(limit));
        params.append("visibleOnly", "true");
        params.append("category", slug);

        const res = await fetch(`${getBaseUrl()}/api/products?${params.toString()}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.products || [];
    } catch {
        return [];
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

export async function createProduct(data: FormData): Promise<Product> {
    const res = await fetch(`${getBaseUrl()}/api/admin/products`, {
        method: "POST",
        credentials: "include",
        body: data,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur création produit");
    }

    return await res.json();
}

export async function updateProduct(id: number, data: FormData): Promise<Product> {
    const res = await fetch(`${getBaseUrl()}/api/admin/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: data,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur modification produit");
    }

    return await res.json();
}

export async function deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${getBaseUrl()}/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur suppression produit");
    }
}