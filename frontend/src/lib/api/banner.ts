import { Banner } from "@/types/Banner";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getBanners(): Promise<Banner[]> {
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

export async function createBanner(data: {
    message: string;
    variant: string;
    ctaLabel: string;
    ctaHref: string;
    dismissible: boolean;
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

    return await res.json();
}

export async function updateBanner(id: number, data: {
    message: string;
    variant: string;
    ctaLabel: string;
    ctaHref: string;
    dismissible: boolean;
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

    return await res.json();
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
}
