"use client";

import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, } from "@/components/ui/select";
import { ImageUploader } from "@/components/shared/ImageUploader";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "../RichEditorText";
import { Category } from "@/types/Category";
import { validateSalePrice, calculateComplementaryValue } from "@/lib/utils/priceCalculator";
import { AlertCircle } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/api/product";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    categories: Category[];
    onSave: () => void;
}

const emptyProduct = {
    name: "",
    slug: "",
    description: "",
    hidden: false,
    price: 0,
    stock: 1,
    weight: 0,
    height: 0,
    lenght: 0,
    width: 0,
    categoryId: 0,
    color: "",
    material: "",
    isOnSale: false,
    salePrice: null,
    salePercentage: null,
};

export function ProductDialog({
    open,
    onOpenChange,
    product,
    categories,
    onSave,
}: ProductDialogProps) {
    const [form, setForm] = useState<Partial<Product>>(emptyProduct);
    const [files, setFiles] = useState<File[]>([]);
    const [keptImages, setKeptImages] = useState<string[]>([]);
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const [saleError, setSaleError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const isEditMode = !!product;

    const selectedCategory = categories.find(
        (cat) => cat.id === form.categoryId
    );

    useEffect(() => {
        if (open) {
            if (isEditMode && product) {
                setForm(product);
                setKeptImages(product.images as string[]);
                setRemoveImages([]);
            } else {
                setForm(emptyProduct);
                setKeptImages([]);
                setRemoveImages([]);
            }
            setFiles([]);
            setSaleError("");
            setIsLoading(false);
        }
    }, [open, product, isEditMode]);

    const removeImage = async (url: string) => {
        setKeptImages((prev) => prev.filter((img) => img !== url));
        setRemoveImages((prev) => [...prev, url]);
    };

    const handleChange = (field: keyof Product, value: any) => {
        let newForm = { ...form, [field]: value };

        if ((field === "salePrice" || field === "salePercentage") && form.isOnSale) {
            if (field === "salePrice" && value) {
                const calculatedPercentage = calculateComplementaryValue(form.price as number, "price", value);
                newForm.salePercentage = calculatedPercentage;
            } else if (field === "salePercentage" && value) {
                const calculatedPrice = calculateComplementaryValue(form.price as number, "percentage", value);
                newForm.salePrice = calculatedPrice;
            }
        }

        setForm(newForm);

        if (field === "isOnSale" || field === "salePrice" || field === "salePercentage") {
            if (value === true || (field !== "isOnSale" && form.isOnSale)) {
                const newSalePrice = field === "salePrice" ? value : newForm.salePrice;
                const newSalePercentage = field === "salePercentage" ? value : newForm.salePercentage;

                const validation = validateSalePrice(
                    form.price as number,
                    newSalePrice,
                    newSalePercentage
                );
                setSaleError(validation.error || "");
            } else {
                setSaleError("");
            }
        }
    };

    const handleNameChange = (value: string) => {
        handleChange("name", value);

        if (!isEditMode) {
            const slug = value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
            setForm((prev) => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.isOnSale) {
            const validation = validateSalePrice(form.price as number, form.salePrice, form.salePercentage);
            if (!validation.valid) {
                setSaleError(validation.error || "Erreur de validation");
                toast.error(validation.error || "Erreur de validation");
                return;
            }
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                const val = typeof value === "boolean" ? (value ? "true" : "false") : String(value ?? "");
                formData.append(key, val);
            });

            if (isEditMode && product) {
                keptImages.forEach((url) => {
                    formData.append("keptImages", url);
                });
                removeImages.forEach((url) => {
                    formData.append("removedImages", url);
                });
            }

            files.forEach((file) => {
                formData.append("images", file);
            });

            if (isEditMode && product) {
                await updateProduct(product.id, formData);
                toast.success("Produit modifié avec succès !");
            } else {
                await createProduct(formData);
                toast.success("Produit ajouté avec succès !");
            }

            onOpenChange(false);
            onSave();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Modifier le sac" : "Ajouter un sac"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Modifiez les informations du sac et cliquez sur \"Enregistrer\" pour sauvegarder les modifications."
                            : "Remplissez les informations du sac et cliquez sur \"Enregistrer\" pour l'ajouter à la boutique."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Nom du produit</FieldLabel>
                                <Input
                                    value={form.name || ""}
                                    disabled={isLoading}
                                    required
                                    onChange={(e) => handleNameChange(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Slug</FieldLabel>
                                <Input
                                    value={form.slug || ""}
                                    disabled
                                    required
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <div className="border rounded-md bg-white">
                                <RichTextEditor
                                    value={form.description || ""}
                                    onChange={(value) => handleChange("description", value)}
                                />
                            </div>
                        </Field>

                        <Field>
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="hidden"
                                    checked={form.hidden || false}
                                    disabled={isLoading}
                                    onCheckedChange={(checked) => handleChange("hidden", checked)}
                                />
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
                                    disabled={isLoading}
                                    value={form.price || ""}
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
                                    disabled={isLoading}
                                    value={form.stock || ""}
                                    required
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleChange("stock", value === "" ? 0 : parseFloat(value));
                                    }}
                                />
                            </Field>
                        </div>

                        <Field>
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id="isOnSale"
                                    checked={form.isOnSale || false}
                                    disabled={isLoading}
                                    onCheckedChange={(checked) => handleChange("isOnSale", checked)}
                                />
                                <div className="grid gap-2">
                                    <Label htmlFor="isOnSale">Mettre en solde</Label>
                                </div>
                            </div>
                        </Field>

                        {form.isOnSale && (
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>Nouveau prix (€)</FieldLabel>
                                    <Input
                                        type="number"
                                        step="any"
                                        min={0}
                                        disabled={isLoading}
                                        value={form.salePrice ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleChange("salePrice", value === "" ? null : parseFloat(value));
                                        }}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Pourcentage de réduction (%)</FieldLabel>
                                    <Input
                                        type="number"
                                        step="any"
                                        min={0}
                                        max={100}
                                        disabled={isLoading}
                                        value={form.salePercentage ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleChange("salePercentage", value === "" ? null : parseFloat(value));
                                        }}
                                    />
                                </Field>
                                {saleError && (
                                    <div className="col-span-2 flex items-start gap-2 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>{saleError}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-4 items-end">
                            <Field>
                                <FieldLabel>Poids (g)</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    min={0}
                                    disabled={isLoading}
                                    value={form.weight || ""}
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
                                    disabled={isLoading}
                                    value={form.height || ""}
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
                                    disabled={isLoading}
                                    value={form.lenght || ""}
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
                                    disabled={isLoading}
                                    value={form.width || ""}
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
                                    value={form.color || ""}
                                    disabled={isLoading}
                                    required
                                    onChange={(e) => handleChange("color", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Matière</FieldLabel>
                                <Input
                                    value={form.material || ""}
                                    disabled={isLoading}
                                    required
                                    onChange={(e) => handleChange("material", e.target.value)}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Catégorie</FieldLabel>
                            <Select
                                disabled={isLoading}
                                onValueChange={(value) =>
                                    handleChange("categoryId", parseInt(value))
                                }
                                value={String(form.categoryId || "")}
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
                            {isEditMode && keptImages.length > 0 && (
                                <ul className="mt-2 text-sm">
                                    {keptImages.map((url, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between items-center text-muted-foreground"
                                        >
                                            <span className="truncate">
                                                {url.split("/").pop()}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={isLoading}
                                                onClick={() => removeImage(url)}
                                                className="text-red-500 text-xs hover:underline disabled:opacity-50"
                                            >
                                                Supprimer
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                                <ImageUploader onChange={(files) => {
                                    if (Array.isArray(files)) {
                                        setFiles(files);
                                    } else {
                                        setFiles([files]);
                                    }
                                }} maxFiles={7} />
                            </div>
                        </Field>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
