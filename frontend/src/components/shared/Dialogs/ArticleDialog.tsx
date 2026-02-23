"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/Article";
import { RichTextEditor } from "@/components/shared/RichEditorText";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ImageUploader } from "../ImageUploader";

interface ArticleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    article?: Article | null;
    onSave: (data: FormData) => Promise<void>;
}

export function ArticleDialog({ open, onOpenChange, article, onSave }: ArticleDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Sacs à Bonheurs",
        category: "Blog",
        keywords: "",
        metaDescription: "",
        readingTime: "5",
        published: false,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                content: article.content,
                author: article.author,
                category: article.category,
                keywords: article.keywords,
                metaDescription: article.metaDescription,
                readingTime: String(article.readingTime),
                published: article.published || false,
            });
        } else {
            setFormData({
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                author: "Sacs à Bonheurs",
                category: "Blog",
                keywords: "",
                metaDescription: "",
                readingTime: "5",
                published: false,
            });
        }
        setImageFile(null);
        setExistingImage(article?.image ?? null);
        setRemoveImage(false);
        setError(null);
    }, [article, open]);

    const handleRemoveImage = () => {
        setExistingImage(null);
        setRemoveImage(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(e);

        const slug = e.target.value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
        setFormData((prev) => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setisLoading(true);

            const data = new FormData();
            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("excerpt", formData.excerpt);
            data.append("content", formData.content);
            data.append("author", formData.author);
            data.append("category", formData.category);
            data.append("keywords", formData.keywords);
            data.append("metaDescription", formData.metaDescription);
            data.append("readingTime", formData.readingTime);
            data.append("published", String(formData.published));

            if (removeImage) {
                data.append("removeImage", "true");
            }

            if (imageFile) {
                data.append("image", imageFile);
            }

            await onSave(data);
            onOpenChange(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setisLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-screen overflow-y-auto min-w-3/4">
                <DialogHeader>
                    <DialogTitle>
                        {article ? "Modifier l'article" : "Créer un nouvel article"}
                    </DialogTitle>
                    <DialogDescription>
                        {article
                            ? "Modifiez les informations de l'article et cliquez sur \"Enregistrer\" pour sauvegarder les modifications."
                            : "Remplissez les informations de l'article et cliquez sur \"Enregistrer\" pour l'ajouter au blog."}
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
                        <Field>
                            <FieldLabel>Titre</FieldLabel>
                            <Input
                                name="title"
                                value={formData.title || ""}
                                disabled={isLoading}
                                required
                                onChange={(e) => handleNameChange(e)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Slug</FieldLabel>
                            <Input
                                name="slug"
                                value={formData.slug || ""}
                                disabled
                                required
                            />
                        </Field>


                        <Field>
                            <FieldLabel>Photo</FieldLabel>
                            {existingImage && (
                                <ul className="mt-2 text-sm">
                                    <li className="flex justify-between items-center text-muted-foreground">
                                        <span className="truncate">
                                            {existingImage.split("/").pop()}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={handleRemoveImage}
                                            className="text-red-500 text-xs hover:underline disabled:opacity-50"
                                        >
                                            Supprimer
                                        </button>
                                    </li>
                                </ul>
                            )}
                            <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
                                <ImageUploader
                                    onChange={(files) => {
                                        const nextFile = Array.isArray(files) ? files[0] : files;
                                        setImageFile(nextFile ?? null);
                                        if (article?.image) {
                                            setRemoveImage(true);
                                        }
                                    }}
                                    maxFiles={1}
                                />
                            </div>
                        </Field>

                        <Field>
                            <FieldLabel>Extrait (résumé court)</FieldLabel>
                            <Textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                placeholder="Résumé court du contenu de l'article"
                                rows={3}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Contenu</FieldLabel>
                            <RichTextEditor
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Auteur</FieldLabel>
                            <Input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                placeholder="Sacs à Bonheurs"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Catégorie</FieldLabel>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, category: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Blog">Blog</SelectItem>
                                    <SelectItem value="Guide">Guide</SelectItem>
                                    <SelectItem value="Durabilité">Durabilité</SelectItem>
                                    <SelectItem value="Tendances">Tendances</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel>Mots-clés (séparés par des virgules)</FieldLabel>
                            <Input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleInputChange}
                                placeholder="mot-clé1, mot-clé2, mot-clé3"
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Meta description (155-160 caractères)</FieldLabel>
                            <Textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                placeholder="Description pour les moteurs de recherche"
                                rows={2}
                                maxLength={160}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {formData.metaDescription.length}/160 caractères
                            </p>
                        </Field>

                        <Field>
                            <FieldLabel>Temps de lecture (minutes)</FieldLabel>
                            <Input
                                type="number"
                                name="readingTime"
                                value={formData.readingTime}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </Field>

                        <Field>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="published"
                                    checked={formData.published}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            published: checked === true,
                                        }))
                                    }
                                />
                                <Label htmlFor="published">Publier cet article</Label>
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
