"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useCategoryStore } from "@/lib/categoryStore";
import { ImageUploader } from "../ImageUploader";

export function AddDialog() {
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 1,
        weight: 0,
        height: 0,
        lenght: 0,
        width: 0,
        categoryId: 0,
    });

    const [files, setFiles] = useState<File[]>([]);
    const categories = useCategoryStore((state) => state.categories);

    const selectedCategory = categories.find(
        (cat) => cat.id === form.categoryId
    );

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) =>
            formData.append(key, String(value))
        );
        files.forEach((file) => formData.append("images", file));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Erreur inconnue");
            }

            const data = await res.json();

            if (data.success) {
                setForm({
                    name: "",
                    slug: "",
                    description: "",
                    price: 0,
                    stock: 1,
                    weight: 0,
                    height: 0,
                    lenght: 0,
                    width: 0,
                    categoryId: 0,
                });
                setFiles([]);
            }

        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Ajouter un sac
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un sac</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Nom du produit</FieldLabel>
                                <Input
                                    value={form.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Slug</FieldLabel>
                                <Input
                                    value={form.slug}
                                    onChange={(e) => handleChange("slug", e.target.value)}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea
                                value={form.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Prix (€)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) =>
                                        handleChange("price", parseFloat(e.target.value))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Quantité</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) =>
                                        handleChange("stock", parseInt(e.target.value))
                                    }
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <Field>
                                <FieldLabel>Poids (g)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.weight}
                                    onChange={(e) =>
                                        handleChange("weight", parseFloat(e.target.value))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Hauteur (cm)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.height}
                                    onChange={(e) =>
                                        handleChange("height", parseFloat(e.target.value))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Longueur (cm)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.lenght}
                                    onChange={(e) =>
                                        handleChange("lenght", parseFloat(e.target.value))
                                    }
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Largeur (cm)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.width}
                                    onChange={(e) =>
                                        handleChange("width", parseFloat(e.target.value))
                                    }
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
                            <ImageUploader onChange={setFiles} />
                        </Field>

                        <DialogClose>
                            <Button type="submit" className="w-full">
                                Enregistrer
                            </Button>
                        </DialogClose>

                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
