import { Article } from "@/types/Article";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getArticles(): Promise<Article[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/articles`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération articles DB:", error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/articles/${slug}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return null;

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération article DB:", error);
        return null;
    }
}

export async function getAdminArticles(): Promise<Article[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/articles`, {
            credentials: "include",
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération articles admin:", error);
        return [];
    }
}

export async function createArticle(data: FormData): Promise<Article> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/articles`, {
            method: "POST",
            credentials: "include",
            body: data,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Erreur création article");
        }

        return await res.json();
    } catch (error) {
        console.error("Erreur création article:", error);
        throw new Error("Erreur création article");
    }
}

export async function updateArticle(id: number, data: FormData): Promise<Article> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/articles/${id}`, {
            method: "PUT",
            credentials: "include",
            body: data,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Erreur modification article");
        }

        return await res.json();
    } catch (error) {
        console.error("Erreur modification article:", error);
        throw new Error("Erreur modification article");
    }
}

export async function deleteArticle(id: number): Promise<any> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/articles/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Erreur suppression article");
        }
        return await res.json();
    } catch (error) {
        console.error("Erreur suppression article:", error);
        throw new Error("Erreur suppression article");
    }
}
