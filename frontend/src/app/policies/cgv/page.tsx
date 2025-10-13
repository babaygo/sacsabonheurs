"use client";

import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function CGVPage() {
    const [cgv, setCgv] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCGV = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Erreur API : ${res.status} – ${text}`);
                }

                const data = await res.json();
                setCgv(data.cgv || "");
            } catch (err: any) {
                console.error("Erreur CGV :", err.message);
                setError("Impossible de charger les CGV.");
            } finally {
                setLoading(false);
            }
        };

        fetchCGV();
    }, []);

    if (loading) {
        return <p className="text-center py-10">Chargement des CGV...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-6">
            <h1 className="text-3xl font-semibold">Conditions générales de vente</h1>
            <p className="whitespace-pre-line">{cgv}</p>
        </div>
    );
}

