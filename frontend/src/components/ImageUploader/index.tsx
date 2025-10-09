"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

export function ImageUploader({ onChange }: { onChange: (files: File[]) => void }) {
    const [files, setFiles] = useState<File[]>([]);
    const onDrop = useCallback(
        (newFiles: File[]) => {
            const combined = [...files, ...newFiles];
            if (combined.length > 5) {
                alert("Maximum 5 images autorisées");
                return;
            }
            setFiles(combined);
            onChange(combined);
        },
        [files, onChange]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
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
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <ul className="mt-4 text-left text-sm">
                        {files.map((file, i) => (
                            <li key={i} className="truncate">
                                {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
