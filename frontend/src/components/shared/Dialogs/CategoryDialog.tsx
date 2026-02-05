"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/Category";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { createCategory, updateCategory } from "@/lib/api/category";
import toast from "react-hot-toast";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null;
    onSave: () => void;
}

export function CategoryDialog({ open, onOpenChange, category, onSave }: CategoryDialogProps) {
    const [form, setForm] = useState({
        name: "",
        slug: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                slug: category.slug,
            });
        } else {
            setForm({
                name: "",
                slug: "",
            });
        }
        setError(null);
    }, [category, open]);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => {
            const updatedForm = { ...prev, [field]: value };

            if (field === "name") {
                const slug = value
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .trim()
                    .replace(/\s+/g, "-");

                updatedForm.slug = slug;
            }

            return updatedForm;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.name.trim()) {
            setError("Le nom de la catégorie est requis");
            return;
        }

        try {
            setLoading(true);

            if (category) {
                // UPDATE
                await updateCategory(category.id, {
                    name: form.name,
                    slug: form.slug,
                });
                toast.success("Catégorie modifiée avec succès !");
            } else {
                // CREATE
                await createCategory({
                    name: form.name,
                    slug: form.slug,
                });
                toast.success("Catégorie ajoutée avec succès !");
            }

            onOpenChange(false);
            onSave();
        } catch (err: any) {
            const errorMsg = err.message || "Erreur lors de l'enregistrement";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {category ? "Modifier la catégorie" : "Ajouter une catégorie"}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? "Modifiez les informations puis cliquez sur \"Enregistrer\"."
                            : "Remplissez les informations et cliquez sur \"Enregistrer\" pour ajouter la catégorie."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Nom de la catégorie</FieldLabel>
                                <Input
                                    value={form.name}
                                    required
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    disabled={loading}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Slug</FieldLabel>
                                <Input
                                    value={form.slug}
                                    disabled
                                />
                            </Field>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {category ? "Modifier" : "Ajouter"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
