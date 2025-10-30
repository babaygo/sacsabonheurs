"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { PdfExtractor } from "@/components/shared/PdfExtractor";
import { RichTextEditor } from "@/components/shared/RichEditorText";
import { getLegalContent, updateLegalContent } from "@/lib/api/legal";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLegalClient() {
    const [legal, setLegal] = useState({
        mentions: "",
        cgv: "",
        privacy: "",
        updatedAt: new Date()
    });
    const [loadingLegal, setLoadingLegal] = useState(false);
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();

    const fetchLegalContent = async () => {
        setLoadingLegal(true);
        try {
            const legal = await getLegalContent();
            if (legal) {
                setLegal({
                    mentions: legal.mentions ?? "",
                    cgv: legal.cgv ?? "",
                    privacy: legal.privacy ?? "",
                    updatedAt: legal.updatedAt,
                });
            }
        } catch (err) {
            console.error("Erreur réseau :", err);
            toast.error("Impossible de charger le contenu légal")
        } finally {
            setLoadingLegal(false);
        }
    };

    useEffect(() => {
        if (loadingUser) return;
        if (user?.role !== "admin") {
            router.push("/");
            return;
        }
        fetchLegalContent();
    }, [user, loadingUser, router]);


    const handleChange = (field: keyof typeof legal) => (value: string) => {
        setLegal((prev) => ({ ...prev, [field]: value }));
    };

    const handleExtract = (field: keyof typeof legal) => (text: string) => {
        const htmlContent = text
            .split("\n\n")
            .map((paragraph) => `<p>${paragraph.trim()}</p>`)
            .join("");
        setLegal((legal) => ({ ...legal, [field]: htmlContent }));
    };

    const handleSave = async () => {
        setLoadingLegal(true);
        try {
            await updateLegalContent(legal)
            toast.success("Contenu légal enregistré avec succès !");
        } catch (err: any) {
            console.error("Erreur réseau ou serveur :", err);
            toast.error(err.message || "Erreur inconnue.");
        } finally {
            setLoadingLegal(false);
        }
    };

    if (loadingUser || loadingLegal) return <Spinner />;

    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <h1 className="text-2xl font-bold">Contenu légal</h1>

                <p>
                    Dernière mise à jour le{" "}
                    {legal.updatedAt
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

                <Button onClick={handleSave} disabled={loadingLegal}>
                    {loadingLegal ? <Spinner /> : "Enregistrer"}
                </Button>
            </div>
        </div>
    );
}