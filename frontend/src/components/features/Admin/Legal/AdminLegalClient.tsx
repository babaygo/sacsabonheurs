"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { PdfExtractor } from "@/components/shared/PdfExtractor";
import { RichTextEditor } from "@/components/shared/RichEditorText";

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
                return null;
            }
            return res.json();
        } catch (err) {
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

    const handleChange = (field: keyof typeof legal) => (value: string) => {
        setLegal({ ...legal, [field]: value });
    };

    const handleExtract = (field: keyof typeof legal) => (text: string) => {
        // Convertir le texte brut en HTML avec des paragraphes
        const htmlContent = text
            .split("\n\n")
            .map((paragraph) => `<p>${paragraph.trim()}</p>`)
            .join("");
        setLegal({ ...legal, [field]: htmlContent });
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
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <h1>Contenu légal</h1>

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
                    <PdfExtractor onExtract={handleExtract("mentions")} />
                    <RichTextEditor
                        value={legal.mentions}
                        onChange={handleChange("mentions")}
                    />
                </div>

                <div className="space-y-4">
                    <Label htmlFor="cgv">Conditions générales de vente</Label>
                    <PdfExtractor onExtract={handleExtract("cgv")} />
                    <RichTextEditor
                        value={legal.cgv}
                        onChange={handleChange("cgv")}
                    />
                </div>

                <div className="space-y-4">
                    <Label htmlFor="privacy">Politique de confidentialité</Label>
                    <PdfExtractor onExtract={handleExtract("privacy")} />
                    <RichTextEditor
                        value={legal.privacy}
                        onChange={handleChange("privacy")}
                    />
                </div>

                <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>
        </div>
    );
}