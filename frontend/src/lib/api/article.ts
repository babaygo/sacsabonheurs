import { Article } from "@/types/Article";
import { getBaseUrl } from "../utils/getBaseUrl";

async function revalidateCache(paths: string[]) {
    try {
        await fetch("/api/revalidate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-revalidate-secret": process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "",
            },
            body: JSON.stringify({ paths }),
        });
    } catch (error) {
        console.warn("Cache revalidation failed:", error);
    }
}

export async function getArticles(): Promise<Article[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/articles`);

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération articles DB:", error);
        return [];
    }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/articles/${slug}`);

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

        const article = await res.json();
        await revalidateCache(["/blog", `/blog/${article.slug}`]);
        return article;
    } catch (error) {
        console.error("Erreur création article:", error);
        throw new Error("Erreur création article");
    }
}

export async function updateArticle(id: number, data: FormData, oldSlug?: string): Promise<Article> {
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

        const article = await res.json();
        const pathsToRevalidate = ["/blog", `/blog/${article.slug}`];
        if (oldSlug && oldSlug !== article.slug) {
            pathsToRevalidate.push(`/blog/${oldSlug}`);
        }
        await revalidateCache(pathsToRevalidate);
        return article;
    } catch (error) {
        console.error("Erreur modification article:", error);
        throw new Error("Erreur modification article");
    }
}

export async function deleteArticle(id: number, slug?: string): Promise<any> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/articles/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Erreur suppression article");
        }
        const result = await res.json();
        if (slug) {
            await revalidateCache(["/blog", `/blog/${slug}`]);
        }
        return result;
    } catch (error) {
        console.error("Erreur suppression article:", error);
        throw new Error("Erreur suppression article");
    }
}

