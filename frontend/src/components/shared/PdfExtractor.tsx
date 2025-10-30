"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

interface PdfExtractorProps {
    onExtract: (text: string) => void;
}

export function PdfExtractor({ onExtract }: PdfExtractorProps) {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Veuillez sélectionner un fichier PDF");
            return;
        }

        setFileName(file.name);
        setLoading(true);

        try {
            const pdfjsLib = await import("pdfjs-dist");

            pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                // Trier les éléments par position verticale puis horizontale
                const items = textContent.items as any[];
                items.sort((a, b) => {
                    const yDiff = Math.abs(a.transform[5] - b.transform[5]);
                    // Si sur la même ligne (différence Y < 5)
                    if (yDiff < 5) {
                        return a.transform[4] - b.transform[4]; // Trier par X
                    }
                    return b.transform[5] - a.transform[5]; // Trier par Y (inversé)
                });

                let lastY = -1;
                let lineText = "";

                items.forEach((item, index) => {
                    const y = item.transform[5];
                    const text = item.str;

                    // Détection de nouvelle ligne
                    if (lastY !== -1 && Math.abs(y - lastY) > 5) {
                        fullText += lineText.trim() + "\n";
                        lineText = "";
                    }

                    // Ajouter le texte avec l'espacement approprié
                    if (item.hasEOL || (index < items.length - 1 &&
                        Math.abs(items[index + 1].transform[4] - (item.transform[4] + item.width)) > 10)) {
                        lineText += text + " ";
                    } else {
                        lineText += text;
                    }

                    lastY = y;
                });

                // Ajouter la dernière ligne
                if (lineText.trim()) {
                    fullText += lineText.trim() + "\n";
                }

                // Saut de page
                if (i < pdf.numPages) {
                    fullText += "\n---\n\n";
                }
            }

            if (fullText.trim()) {
                onExtract(fullText.trim());
                toast.success("Texte extrait avec succès !");
            } else {
                toast.error("Aucun texte trouvé dans le PDF");
            }
        } catch (error) {
            console.error("Erreur lors de l'extraction du PDF:", error);
            toast.error("Erreur lors de l'extraction du texte");
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
            />

            <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                        <span>Extraction en cours...</span>
                    </>
                ) : (
                    <>
                        <Upload className="h-4 w-4" />
                        <span>Importer un PDF</span>
                    </>
                )}
            </Button>

            {fileName && !loading && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                    <FileText className="h-4 w-4" />
                    <span>{fileName}</span>
                </div>
            )}
        </div>
    );
}