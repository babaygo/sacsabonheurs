"use client";

import { useState, useEffect } from "react";
import { Collection } from "@/types/Collection";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ImageUploader } from "../ImageUploader";

interface CollectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    collection?: Collection | null;
    onSave: (data: FormData) => Promise<void>;
}

const emptyChar = { label: "", value: "" };

export function CollectionDialog({ open, onOpenChange, collection, onSave }: CollectionDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        subtitle: "",
        material: "",
        excerpt: "",
        metaTitle: "",
        metaDescription: "",
        featured: false,
        order: "0",
    });

    const [description, setDescription] = useState<string[]>(["", "", ""]);
    const [characteristics, setCharacteristics] = useState<{ label: string; value: string }[]>([
        { ...emptyChar },
        { ...emptyChar },
        { ...emptyChar },
        { ...emptyChar },
    ]);

    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [existingHeroImage, setExistingHeroImage] = useState<string | null>(null);
    const [removeHeroImage, setRemoveHeroImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (collection) {
            setFormData({
                title: collection.title,
                slug: collection.slug,
                subtitle: collection.subtitle,
                material: collection.material,
                excerpt: collection.excerpt,
                metaTitle: collection.metaTitle,
                metaDescription: collection.metaDescription,
                featured: collection.featured,
                order: String(collection.order),
            });
            setDescription(
                Array.isArray(collection.description) && collection.description.length > 0
                    ? collection.description
                    : ["", "", ""]
            );
            setCharacteristics(
                Array.isArray(collection.characteristics) && collection.characteristics.length > 0
                    ? collection.characteristics
                    : [{ ...emptyChar }, { ...emptyChar }, { ...emptyChar }, { ...emptyChar }]
            );
            setExistingHeroImage(collection.heroImage ?? null);
        } else {
            setFormData({
                title: "",
                slug: "",
                subtitle: "",
                material: "",
                excerpt: "",
                metaTitle: "",
                metaDescription: "",
                featured: false,
                order: "0",
            });
            setDescription(["", "", ""]);
            setCharacteristics([{ ...emptyChar }, { ...emptyChar }, { ...emptyChar }, { ...emptyChar }]);
            setExistingHeroImage(null);
        }
        setHeroImageFile(null);
        setRemoveHeroImage(false);
        setError(null);
    }, [collection, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
        setFormData((prev) => ({ ...prev, title, slug }));
    };

    const handleDescriptionChange = (index: number, value: string) => {
        setDescription((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const handleCharChange = (index: number, key: "label" | "value", value: string) => {
        setCharacteristics((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [key]: value };
            return next;
        });
    };

    const addDescriptionParagraph = () => setDescription((prev) => [...prev, ""]);
    const removeDescriptionParagraph = (index: number) =>
        setDescription((prev) => prev.filter((_, i) => i !== index));

    const addCharacteristic = () => setCharacteristics((prev) => [...prev, { ...emptyChar }]);
    const removeCharacteristic = (index: number) =>
        setCharacteristics((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setIsLoading(true);

            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("subtitle", formData.subtitle);
            data.append("material", formData.material);
            data.append("excerpt", formData.excerpt);
            data.append("description", JSON.stringify(description.filter((p) => p.trim() !== "")));
            data.append("characteristics", JSON.stringify(characteristics.filter((c) => c.label.trim() !== "")));
            data.append("metaTitle", formData.metaTitle);
            data.append("metaDescription", formData.metaDescription);
            data.append("featured", String(formData.featured));
            data.append("order", formData.order);

            if (removeHeroImage) {
                data.append("removeHeroImage", "true");
            }
            if (heroImageFile) {
                data.append("heroImage", heroImageFile);
            }

            await onSave(data);
            onOpenChange(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl overflow-y-auto md:w-[75vw]">
                <DialogHeader>
                    <DialogTitle>
                        {collection ? "Modifier la collection" : "Nouvelle collection"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2">
                    <FieldGroup>
                        {/* Title + Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Titre *</FieldLabel>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="ex. Le Liège"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Slug (auto)</FieldLabel>
                                <Input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="ex. liege"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                        </div>

                        {/* Subtitle + Material */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Sous-titre *</FieldLabel>
                                <Input
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleInputChange}
                                    placeholder="ex. Naturel & Vegan"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Matière (filtre produits) *</FieldLabel>
                                <Input
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    placeholder="ex. liege"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                        </div>

                        {/* Hero Image */}
                        <Field>
                            <FieldLabel>Image hero</FieldLabel>
                            {existingHeroImage && (
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                    <span className="truncate">{existingHeroImage.split("/").pop()}</span>
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => { setExistingHeroImage(null); setRemoveHeroImage(true); }}
                                        className="text-destructive text-xs hover:underline disabled:opacity-50"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                                <ImageUploader
                                    onChange={(files) => {
                                        const file = Array.isArray(files) ? files[0] : files;
                                        setHeroImageFile(file ?? null);
                                        if (collection?.heroImage) setRemoveHeroImage(true);
                                    }}
                                    maxFiles={1}
                                />
                            </div>
                        </Field>

                        {/* Excerpt */}
                        <Field>
                            <FieldLabel>Extrait (résumé court) *</FieldLabel>
                            <Textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                placeholder="Résumé affiché sur la page des collections"
                                rows={3}
                                required
                                disabled={isLoading}
                            />
                        </Field>

                        {/* Description paragraphs */}
                        <Field>
                            <FieldLabel>Description (paragraphes éditoriaux)</FieldLabel>
                            <div className="space-y-3">
                                {description.map((para, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Textarea
                                            value={para}
                                            onChange={(e) => handleDescriptionChange(i, e.target.value)}
                                            placeholder={`Paragraphe ${i + 1}`}
                                            rows={3}
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        {description.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDescriptionParagraph(i)}
                                                disabled={isLoading}
                                                className="text-destructive hover:opacity-70 disabled:opacity-30 self-start mt-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addDescriptionParagraph}
                                    disabled={isLoading}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Ajouter un paragraphe
                                </Button>
                            </div>
                        </Field>

                        {/* Characteristics */}
                        <Field>
                            <FieldLabel>Caractéristiques (label / valeur)</FieldLabel>
                            <div className="space-y-2">
                                {characteristics.map((char, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <Input
                                            value={char.label}
                                            onChange={(e) => handleCharChange(i, "label", e.target.value)}
                                            placeholder="Label (ex. Origine)"
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={char.value}
                                            onChange={(e) => handleCharChange(i, "value", e.target.value)}
                                            placeholder="Valeur (ex. Portugal)"
                                            disabled={isLoading}
                                            className="flex-1"
                                        />
                                        {characteristics.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCharacteristic(i)}
                                                disabled={isLoading}
                                                className="text-destructive hover:opacity-70 disabled:opacity-30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addCharacteristic}
                                    disabled={isLoading}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Ajouter une caractéristique
                                </Button>
                            </div>
                        </Field>

                        {/* Meta */}
                        <Field>
                            <FieldLabel>Meta title *</FieldLabel>
                            <Input
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleInputChange}
                                placeholder="Titre SEO"
                                required
                                disabled={isLoading}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Meta description *</FieldLabel>
                            <Textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                placeholder="Description SEO (max 160 caractères)"
                                rows={2}
                                required
                                disabled={isLoading}
                            />
                        </Field>

                        {/* Order + Featured */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <Field>
                                <FieldLabel>Ordre d'affichage</FieldLabel>
                                <Input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    min="0"
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center gap-2 pb-1">
                                    <Checkbox
                                        id="featured"
                                        checked={formData.featured}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev) => ({ ...prev, featured: !!checked }))
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="featured" className="cursor-pointer">
                                        Mettre en avant (accueil)
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (max 3)
                                        </span>
                                    </Label>
                                </div>
                            </Field>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Enregistrement…" : collection ? "Modifier" : "Créer"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
