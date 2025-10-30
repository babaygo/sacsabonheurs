import { getBaseUrl } from "@/lib/utils/getBaseUrl";

const API_URL = getBaseUrl();

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    credentials: "include" as RequestCredentials,
});

export interface ContactFormData {
    name: string;
    email: string;
    order?: string;
    message: string;
}

/**
 * Envoie un message de contact
 * Requiert une authentification
 * @param data - Données du formulaire de contact
 * @returns Confirmation de l'envoi
 */
export const sendContactMessage = async (
    data: ContactFormData
): Promise<{ success: boolean }> => {
    if (!data.name || !data.email || !data.message) {
        throw new Error("Name, email and message are required");
    }

    const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        ...getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));

        if (response.status === 400) {
            throw new Error(error.error || "Missing required fields");
        }

        if (response.status === 401) {
            throw new Error("Authentication required");
        }

        throw new Error(error.error || `Failed to send message: ${response.status}`);
    }

    return response.json();
};