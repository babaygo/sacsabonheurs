"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useSessionContext } from "@/components/SessionProvider";
import { useRouter } from "next/navigation";

export default function AdminLegalClient() {
    const [legal, setLegal] = useState({
        mentions: "",
        cgv: "",
        privacy: "",
        updatedAt: null
    });
    const [loading, setLoading] = useState(false);
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();

    async function getLegals() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
                credentials: "include",
            });
            if (!res.ok) {
                console.error("Erreur API :", res.status, await res.text());
                return null;
            }
            return res.json();
        } catch (err) {
            console.error("Erreur réseau :", err);
            return null;
        }
    }

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role != "admin") {
                router.push("/");
            } else {
                const fetchLegalContent = async () => {
                    const data = await getLegals();

                    if (!data) {
                        return;
                    }

                    setLegal({
                        mentions: data.mentions ?? "",
                        cgv: data.cgv ?? "",
                        privacy: data.privacy ?? "",
                        updatedAt: data.updatedAt ?? null,
                    });
                }
                fetchLegalContent();
            }
        }
    }, [user, loadingUser, router]);

    const handleChange = (field: keyof typeof legal) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLegal({ ...legal, [field]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/legal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(legal),
                credentials: "include"
            });

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement.");
            toast.success("Contenu légal enregistré avec succès !");
        } catch (err: any) {
            toast.error(err.message || "Erreur inconnue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-semibold">Contenu légal</h1>

            <p>
                Dernière mise à jour le{" "}
                {legal.updatedAt && !isNaN(Date.parse(legal.updatedAt))
                    ? new Date(legal.updatedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : "non renseignée"}
                .
            </p>

            <div className="space-y-4">
                <Label htmlFor="mentions">Mentions légales</Label>
                <Textarea
                    id="mentions"
                    rows={8}
                    value={legal.mentions}
                    onChange={handleChange("mentions")}
                />
            </div>

            <div className="space-y-4">
                <Label htmlFor="cgv">Conditions générales de vente</Label>
                <Textarea
                    id="cgv"
                    rows={8}
                    value={legal.cgv}
                    onChange={handleChange("cgv")}
                />
            </div>

            <div className="space-y-4">
                <Label htmlFor="privacy">Politique de confidentialité</Label>
                <Textarea
                    id="privacy"
                    rows={8}
                    value={legal.privacy}
                    onChange={handleChange("privacy")}
                />
            </div>

            <Button onClick={handleSave} disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
        </div>
    );
}
