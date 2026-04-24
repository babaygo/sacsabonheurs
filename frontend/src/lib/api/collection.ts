import { Collection } from "@/types/Collection";
import { getBaseUrl } from "../utils/getBaseUrl";

async function revalidateCache(paths: string[]) {
    try {
        const response = await fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ paths }),
        });
        if (!response.ok) console.warn("Cache revalidation failed:", response.status);
    } catch (error) {
        console.warn("Cache revalidation failed:", error);
    }
}

export async function getCollections(): Promise<Collection[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/collections`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export async function getFeaturedCollections(): Promise<Collection[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/collections/featured`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/collections/${slug}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function createCollection(data: FormData): Promise<Collection> {
    const res = await fetch(`${getBaseUrl()}/api/admin/collections`, {
        method: "POST",
        credentials: "include",
        body: data,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur création collection");
    }
    const collection = await res.json();
    await revalidateCache(["/collections", `/collections/${collection.slug}`, "/"]);
    return collection;
}

export async function updateCollection(id: number, data: FormData, oldSlug?: string): Promise<Collection> {
    const res = await fetch(`${getBaseUrl()}/api/admin/collections/${id}`, {
        method: "PUT",
        credentials: "include",
        body: data,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur modification collection");
    }
    const collection = await res.json();
    const paths = ["/collections", `/collections/${collection.slug}`, "/"];
    if (oldSlug && oldSlug !== collection.slug) paths.push(`/collections/${oldSlug}`);
    await revalidateCache(paths);
    return collection;
}

export async function deleteCollection(id: number, slug?: string): Promise<any> {
    const res = await fetch(`${getBaseUrl()}/api/admin/collections/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur suppression collection");
    }
    const result = await res.json();
    if (slug) await revalidateCache(["/collections", `/collections/${slug}`, "/"]);
    return result;
}
