import { ShippingRate } from "@/types/ShippingRate";
import { getBaseUrl } from "../utils/getBaseUrl";

export async function getShippingRates(): Promise<ShippingRate[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate`, {
            credentials: "include",
        });

        if (!res.ok) return [];

        return await res.json();
    } catch (error) {
        console.error("Erreur récupération tarifs livraison:", error);
        return [];
    }
}

export async function createShippingRate(data: FormData): Promise<{ success: boolean }> {
    const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate`, {
        method: "POST",
        credentials: "include",
        body: data,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur création tarif livraison");
    }

    return await res.json();
}

export async function updateShippingRate(
    id: string,
    data: Record<string, any>
): Promise<{ success: boolean }> {
    const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur modification tarif livraison");
    }

    return await res.json();
}

export async function deleteShippingRate(id: string): Promise<void> {
    const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur suppression tarif livraison");
    }
}
