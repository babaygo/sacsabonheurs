import { Article } from "@/types/Article";
import { getBaseUrl } from "../utils/getBaseUrl";

async function revalidateCache(paths: string[]) {
    try {
        const response = await fetch("/api/revalidate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ paths }),
        });

        if (!response.ok) {
            const details = await response.text();
            console.warn("Cache revalidation failed:", response.status, details);
        }
    } catch (error) {
        console.warn("Cache revalidation failed:", error);
    }
}

export async function getArticles(
    page: number = 1,
    limit: number = 5,
    excludeSlug?: string
): Promise<{ data: Article[]; pagination: { total: number; page: number; limit: number; pages: number } }> {
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (excludeSlug) {
            params.set("excludeSlug", excludeSlug);
        }
        const res = await fetch(`${getBaseUrl()}/api/articles?${params.toString()}`);

        if (!res.ok) return { data: [], pagination: { total: 0, page: 1, limit, pages: 0 } };

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération articles DB:", error);
        return { data: [], pagination: { total: 0, page: 1, limit, pages: 0 } };
    }
}

export async function getAllArticles(): Promise<Article[]> {
    try {
        const allArticles: Article[] = [];
        let page = 1;
        let hasMore = true;
        const limit = 50;

        while (hasMore) {
            const { data, pagination } = await getArticles(page, limit);
            allArticles.push(...data);
            hasMore = page < pagination.pages;
            page++;
        }

        return allArticles;
    } catch (error) {
        console.error("Erreur récupération tous les articles:", error);
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

