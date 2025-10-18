"use client";

import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function MentionsLegalesPage() {
    const [mentions, setMentions] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMentions = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Erreur API : ${res.status} – ${text}`);
                }

                const data = await res.json();
                setMentions(data.mentions || "");
            } catch (err: any) {
                console.error("Erreur Mentions légales :", err.message);
                setError("Impossible de charger les mentions légales.");
            } finally {
                setLoading(false);
            }
        };

        fetchMentions();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Chargement des mentions légales...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-6">
            <h1 className="text-2xl font-bold">Mentions légales</h1>
            <p className="whitespace-pre-line">{mentions}</p>
        </div>
    );
}
