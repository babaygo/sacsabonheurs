"use client";

import { useState } from "react";
import { Category } from "@/types/Category";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategories";
import { RichTextEditor } from "../RichEditorText";

export function AddDialog({ categories, onSuccess }: { categories: Category[], onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        hidden: "false",
        price: "",
        stock: 1,
        weight: "",
        height: "",
        lenght: "",
        width: "",
        categoryId: 0,
        color: "",
        material: ""
    });
    const [files, setFiles] = useState<File[]>([]);

    const selectedCategory = categories.find(
        (cat) => cat.id === form.categoryId
    );

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
        files.forEach((file) => formData.append("images", file));

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/products`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Erreur inconnue");
            }

            const data = await res.json();

            if (data) {
                setForm({
                    name: "",
                    slug: "",
                    description: "",
                    hidden: "false",
                    price: "",
                    stock: 1,
                    weight: "",
                    height: "",
                    lenght: "",
                    width: "",
                    categoryId: 0,
                    color: "",
                    material: ""
                });
                setFiles([]);
                setOpen(false);
                onSuccess();
                toast.success("Produit ajouté avec succès !")
            }

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Plus />
                    Ajouter un sac
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un sac</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations du sac et cliquez sur "Enregistrer" pour
                        l'ajouter à la boutique.
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
                            <RichTextEditor
                                value={form.description}
                                onChange={(value) => handleChange("description", value)}
                            />
                        </Field>

                        <Field>
                            <div className="flex items-start gap-3">
                                <Checkbox id="hidden" checked={form.hidden === "false" ? false : true}
                                    onCheckedChange={(checked: boolean) => handleChange("hidden", checked)} />
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
                                    {categories.map((cat: Category) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>Photos</FieldLabel>
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
