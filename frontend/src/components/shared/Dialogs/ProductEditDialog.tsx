"use client";

import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, } from "@/components/ui/select";
import { ImageUploader } from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "../RichEditorText";
import { Category } from "@/types/Category";

export function EditDialog({ product, categories, onSuccess }: { product: Product, categories: Category[], onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(product);


    const selectedCategory = categories.find(
        (cat) => cat.id === form.categoryId
    );

    const existingImages = product.images as string[];

    const [files, setFiles] = useState<File[]>([]);
    const [keptImages, setKeptImages] = useState<string[]>(existingImages);
    const [removeImages, setRemoveImages] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setKeptImages(product.images);
            setFiles([]);
        }
    }, [open]);

    const removeImage = async (url: string) => {
        setKeptImages((prev) => prev.filter((img) => img !== url));
        setRemoveImages((prev) => [...prev, url]);
    };

    const handleChange = (field: keyof Product, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            const val = typeof value === "boolean" ? (value ? "true" : "false") : String(value);
            formData.append(key, val);
        });

        keptImages.forEach((url) => {
            formData.append("keptImages", url);
        });

        removeImages.forEach((url) => {
            formData.append("removedImages", url);
        });

        files.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/products/${product.id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Erreur inconnue");
            }

            setOpen(false);
            onSuccess();
            toast.success("Produit modifié avec succès !")
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline" onClick={() => setOpen(true)}>
                    Modifier le sac
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier le sac</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du sac et cliquez sur "Enregistrer" pour
                        sauvegarder les modifications.
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

                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <div className="border rounded-md bg-white">
                                <RichTextEditor
                                    value={form.description}
                                    onChange={(value) => handleChange("description", value)}
                                />
                            </div>
                        </Field>

                        <Field>
                            <div className="flex items-start gap-3">
                                <Checkbox id="hidden" checked={form.hidden}
                                    onCheckedChange={(checked) => handleChange("hidden", checked)} />
                                <div className="grid gap-2">
                                    <Label htmlFor="hidden">Masquer dans la boutique</Label>
                                </div>
                            </div>
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

                        <div className="grid grid-cols-4 gap-4 items-end">
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

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Couleur (ex: Noir)</FieldLabel>
                                <Input
                                    value={form.color}
                                    required
                                    onChange={(e) => handleChange("color", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Matière</FieldLabel>
                                <Input
                                    value={form.material}
                                    required
                                    onChange={(e) => handleChange("material", e.target.value)}
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
