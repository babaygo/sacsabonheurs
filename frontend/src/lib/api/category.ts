import { Category } from "@/types/Category";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/categories`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération catégories:", error);
        return [];
    }
}

export async function getAdminCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/categories`, {
            credentials: "include",
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération catégories admin:", error);
        return [];
    }
}

export async function createCategory(data: {
    name: string;
    slug: string;
}): Promise<Category> {
    const res = await fetch(`${getBaseUrl()}/api/admin/categories`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur création catégorie");
    }

    return await res.json();
}

export async function updateCategory(
    id: number,
    data: {
        name: string;
        slug: string;
    }
): Promise<Category> {
    const res = await fetch(`${getBaseUrl()}/api/admin/categories/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur modification catégorie");
    }

    return await res.json();
}

export async function deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${getBaseUrl()}/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur suppression catégorie");
    }
}
