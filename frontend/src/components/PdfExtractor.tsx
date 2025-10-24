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
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                fullText += pageText + "\n\n";
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