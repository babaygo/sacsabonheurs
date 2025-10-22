"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export function ImageUploader({ onChange }: { onChange: (files: File[]) => void }) {
    const [files, setFiles] = useState<File[]>([]);

    function sanitizeFileName(name: string): string {
        return name
            .normalize("NFD") // décompose les accents
            .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
            .replace(/[^a-zA-Z0-9._-]/g, "_") // remplace les caractères spéciaux
            .replace(/_+/g, "_") // évite les doublons
            .replace(/^_+|_+$/g, "") // nettoie début/fin
            .toLowerCase();
    }

    const onDrop = useCallback(
        (newFiles: File[]) => {
            const sanitizedFiles = newFiles.map((file) => {
                const cleanName = sanitizeFileName(file.name);
                return new File([file], cleanName, { type: file.type });
            });

            const combined = [...files, ...sanitizedFiles];
            if (combined.length > 5) {
                toast.error("Maximum 5 images autorisées");
                return;
            }

            setFiles(combined);
            onChange(combined);
        },
        [files, onChange]
    );

    const removeFile = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();

        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        onChange(updated);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
        maxFiles: 5,
    });

    return (
        <div
            {...getRootProps()}
            className="border border-dashed rounded p-4 text-center cursor-pointer hover:bg-muted"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Déposez jusqu’à 5 images…</p>
            ) : (
                <p>Glissez vos images ici ou cliquez (max 5)</p>
            )}

            {files.length > 0 && (
                <ul className="mt-4 text-left text-sm space-y-1">
                    {files.map((file, i) => (
                        <li key={i} className="flex items-center justify-between truncate">
                            <span className="truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={(e) => removeFile(e, i)}
                                className="text-red-500 text-xs ml-2"
                            >
                                <Trash />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
