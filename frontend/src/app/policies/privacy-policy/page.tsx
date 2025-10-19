"use client";

import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import BreadCrumb from "@/components/BreadCrumb";

export default function PrivacyPolicyPage() {
    const [privacy, setPrivacy] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Erreur API : ${res.status} – ${text}`);
                }

                const data = await res.json();
                setPrivacy(data.privacy || "");
            } catch (err: any) {
                console.error("Erreur Politique de confidentialité :", err.message);
                setError("Impossible de charger la politique de confidentialité.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrivacy();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Chargement de la politique de confidentialité...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">{error}</p>;
    }

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Politique de confidentialité" }
                ]}
            />
            <h1 className="text-2xl font-bold">Politique de confidentialité</h1>
            <p className="whitespace-pre-line py-4">{privacy}</p>
        </div>
    );
}
