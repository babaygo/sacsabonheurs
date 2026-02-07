"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
    onChange: (files: File | File[]) => void;
    maxFiles?: number;
}

export function ImageUploader({ onChange, maxFiles = 7 }: ImageUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const normalizedMaxFiles = Math.min(Math.max(maxFiles, 1), 7);
    const isSingleMode = normalizedMaxFiles === 1;

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

            if (isSingleMode) {
                const next = sanitizedFiles.slice(0, 1);
                setFiles(next);
                onChange(next[0] ?? []);
                return;
            }

            const combined = [...files, ...sanitizedFiles];
            if (combined.length > normalizedMaxFiles) {
                toast.error(`Maximum ${normalizedMaxFiles} images autorisees`);
                return;
            }

            setFiles(combined);
            onChange(combined);
        },
        [files, isSingleMode, normalizedMaxFiles, onChange]
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
        multiple: !isSingleMode,
        maxFiles: normalizedMaxFiles,
    });

    return (
        <div
            {...getRootProps()}
            className="border border-dashed rounded p-4 text-center cursor-pointer hover:bg-muted"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Deposez jusqu'a {normalizedMaxFiles} image{normalizedMaxFiles > 1 ? "s" : ""}…</p>
            ) : (
                <p>Glissez vos images ici ou cliquez (max {normalizedMaxFiles})</p>
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
