"use client";

import { useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Pen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorView } from "../Views/ErrorView";
import { Category } from "@/types/Category";

export function EditCategoryDialog({ category, onSuccess }: { category: Category; onSuccess: () => void; }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(category);

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

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) =>
            formData.append(key, String(value))
        );

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/categories/${category.id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                console.error("Erreur API :", res.status, await res.text());
                return <ErrorView error={await res.text()} />;
            }

            setOpen(false);
            onSuccess();
        } catch (error: any) {
            console.error("Erreur réseau :", error);
            return <ErrorView error={error} />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Pen />
                    Modifier
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier une catégorie</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations et cliquez sur "Enregistrer" pour modifier la catégorie.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Nom du produit</FieldLabel>
                                <Input
                                    value={form.name}
                                    required
                                    onChange={(e) => handleChange("name", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Slug</FieldLabel>
                                <Input
                                    value={form.slug}
                                    disabled
                                    required
                                    onChange={(e) => handleChange("slug", e.target.value)}
                                />
                            </Field>
                        </div>

                        <Button type="submit" className="w-full">
                            Enregistrer
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
