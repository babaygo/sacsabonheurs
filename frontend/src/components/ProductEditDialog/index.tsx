"use client";

import { Product } from "@/types/Product";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useCategoryStore } from "@/lib/categoryStore";
import { ImageUploader } from "../ImageUploader";

export function EditDialog({ product, onSuccess }: { product: Product, onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [resetImages, setResetImages] = useState(false);
    const [form, setForm] = useState(product);

    const categories = useCategoryStore((state) => state.categories);
    const selectedCategory = categories.find(
        (cat) => cat.id === form.categoryId
    );

    const existingImages = JSON.parse(product.images) as string[];

    const [files, setFiles] = useState<File[]>([]);
    const [keptImages, setKeptImages] = useState<string[]>(existingImages);

    useEffect(() => {
        if (open) {
            setKeptImages(JSON.parse(product.images));
            setFiles([]);
        }
    }, [open]);

    const removeImage = (url: string) => {
        setKeptImages((prev) => prev.filter((img) => img !== url));
    };

    const handleChange = (field: keyof Product, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) =>
            formData.append(key, String(value))
        );

        formData.append("keptImages", JSON.stringify(keptImages));
        files.forEach((file) => formData.append("images", file));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${product.id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Erreur inconnue");
            }

            setResetImages(true);
            setOpen(false);
            onSuccess();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Modifier le sac
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le sac</DialogTitle>
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
                                    required
                                    onChange={(e) => handleChange("slug", e.target.value)}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                                value={form.description}
                                required
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Prix (€)</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    value={form.price}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("price", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Quantité</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    value={form.stock}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("stock", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <Field>
                                <FieldLabel>Poids (g)</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    value={form.weight}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("weight", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Hauteur (cm)</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    value={form.height}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("height", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Longueur (cm)</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    value={form.lenght}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("lenght", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Largeur (cm)</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    value={form.width}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("width", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Catégorie</FieldLabel>
                            <Select
                                onValueChange={(value) =>
                                    handleChange("categoryId", parseInt(value))
                                }
                                value={String(form.categoryId)}
                            >
                                <SelectTrigger>
                                    {selectedCategory
                                        ? selectedCategory.name
                                        : "Choisir une catégorie"}
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>Photos</FieldLabel>
                            <ul className="mt-2 text-sm">
                                {keptImages.map((url, i) => (
                                    <li key={i} className="flex justify-between items-center text-muted-foreground">
                                        <span className="truncate">{url.split("/").pop()}</span>
                                        <button type="button" onClick={() => removeImage(url)} className="text-red-500 text-xs">
                                            Supprimer
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <ImageUploader onChange={setFiles} />
                        </Field>

                        <Button type="submit" className="w-full">
                            Enregistrer
                        </Button>

                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
