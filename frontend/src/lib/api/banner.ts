import { Banner } from "@/types/Banner";
import { getBaseUrl } from "../utils/getBaseUrl";

const BANNERS_TAG = "banners";

// Invalide le cache du fetch public des bannières (taggé `banners`) pour que
// toute modif admin s'affiche immédiatement sur le site, sans attendre la
// revalidation planifiée. Appelé après chaque mutation (create/update/delete).
export async function revalidateBanners() {
    try {
        const response = await fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ tags: [BANNERS_TAG] }),
        });

        if (!response.ok) {
            const details = await response.text();
            console.warn("Banner cache revalidation failed:", response.status, details);
        }
    } catch (error) {
        console.warn("Banner cache revalidation failed:", error);
    }
}

export async function getAdminBanners(): Promise<Banner[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/banners`, {
            credentials: "include",
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération banneaux:", error);
        return [];
    }
}

export async function getBanners(): Promise<Banner[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/banners`, {
            next: { revalidate: 300, tags: [BANNERS_TAG] },
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération bannières:", error);
        return [];
    }
}

export async function createBanner(data: {
    message: string;
    variant: string;
    ctaLabel: string;
    ctaHref: string;
    active: boolean;
}): Promise<Banner> {
    const res = await fetch(`${getBaseUrl()}/api/admin/banners`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur création banneau");
    }

    const created = await res.json();
    await revalidateBanners();
    return created;
}

export async function updateBanner(id: number, data: {
    message: string;
    variant: string;
    ctaLabel: string;
    ctaHref: string;
    active: boolean;
}): Promise<Banner> {
    const res = await fetch(`${getBaseUrl()}/api/admin/banners/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur modification banneau");
    }

    const updated = await res.json();
    await revalidateBanners();
    return updated;
}

export async function deleteBanner(id: number): Promise<void> {
    const res = await fetch(`${getBaseUrl()}/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur suppression banneau");
    }

    await revalidateBanners();
}
