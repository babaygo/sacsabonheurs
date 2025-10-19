"use client";

import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import BreadCrumb from "@/components/BreadCrumb";

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
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Conditions générales de vente" }
                ]}
            />
            <h1 className="text-2xl font-bold">Conditions générales de vente</h1>
            <p className="whitespace-pre-line py-4">{cgv}</p>
        </div>
    );
}

