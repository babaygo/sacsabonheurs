import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Legal } from "@/types/Legal";

const API_URL = getBaseUrl();

const getHeaders = () => ({
    "Content-Type": "application/json",
});

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    credentials: "include" as RequestCredentials,
});

export interface UpdateLegalDto {
    mentions?: string;
    cgv?: string;
    privacy?: string;
}

/**
 * Récupère le contenu légal (route publique)
 * @returns Le contenu des mentions légales, CGV et politique de confidentialité
 */
export const getLegalContent = async (): Promise<Legal> => {
    const response = await fetch(`${API_URL}/api/admin/legal`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));

        if (response.status === 404) {
            throw new Error("Legal content not found");
        }

        throw new Error(error.error || `Failed to fetch legal content: ${response.status}`);
    }

    return response.json();
};

/**
 * Met à jour le contenu légal (route admin)
 * Utilise upsert : crée ou met à jour le contenu
 * Requiert une authentification admin
 * @param data - Nouveau contenu légal
 * @returns Confirmation du succès
 */
export const updateLegalContent = async (
    data: UpdateLegalDto
): Promise<{ success: boolean }> => {
    if (!data.mentions && !data.cgv && !data.privacy) {
        throw new Error("At least one field (mentions, cgv, privacy) is required");
    }

    const response = await fetch(`${API_URL}/api/admin/legal`, {
        method: "POST",
        ...getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));

        if (response.status === 403) {
            throw new Error("Unauthorized: Admin access required");
        }

        throw new Error(error.error || `Failed to update legal content: ${response.status}`);
    }

    return response.json();
};
