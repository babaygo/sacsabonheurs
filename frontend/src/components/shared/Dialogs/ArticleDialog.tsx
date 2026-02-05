"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types/Article";
import { RichTextEditor } from "@/components/shared/RichEditorText";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Upload } from "lucide-react";

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
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
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
            if (article.image) {
                setImagePreview(article.image);
            }
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
            setImagePreview("");
        }
        setImageFile(null);
        setError(null);
    }, [article, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        setFormData({ ...formData, slug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError("Le titre est requis");
            return;
        }

        if (!formData.slug.trim()) {
            setError("Le slug est requis");
            return;
        }

        if (!formData.content.trim()) {
            setError("Le contenu est requis");
            return;
        }

        try {
            setLoading(true);

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

            if (imageFile) {
                data.append("image", imageFile);
            }

            await onSave(data);
            onOpenChange(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {article ? "Modifier l'article" : "Créer un nouvel article"}
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Titre */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Titre *</label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Titre de l'article"
                            />
                            <Button
                                type="button"
                                onClick={generateSlug}
                                variant="outline"
                            >
                                Générer slug
                            </Button>
                        </div>
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Slug *</label>
                        <Input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="mon-article-slug"
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Image</label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">Cliquez pour uploader une image</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {imagePreview && (
                                <div className="w-32 h-32">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Extrait (résumé court)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            placeholder="Résumé court du contenu de l'article"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Contenu riche */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Contenu *</label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(value) => setFormData({ ...formData, content: value })}
                        />
                    </div>

                    {/* Auteur */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Auteur</label>
                        <Input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            placeholder="Sacs à Bonheurs"
                        />
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Catégorie</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Blog">Blog</option>
                            <option value="Guide">Guide</option>
                            <option value="Durabilité">Durabilité</option>
                            <option value="Tendances">Tendances</option>
                        </select>
                    </div>

                    {/* Mots-clés */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Mots-clés (séparés par des virgules)</label>
                        <Input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleInputChange}
                            placeholder="mot-clé1, mot-clé2, mot-clé3"
                        />
                    </div>

                    {/* Meta description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Meta description (155-160 caractères)</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleInputChange}
                            placeholder="Description pour les moteurs de recherche"
                            rows={2}
                            maxLength={160}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500">
                            {formData.metaDescription.length}/160 caractères
                        </p>
                    </div>

                    {/* Temps de lecture */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold">Temps de lecture (minutes)</label>
                        <Input
                            type="number"
                            name="readingTime"
                            value={formData.readingTime}
                            onChange={handleInputChange}
                            min="1"
                        />
                    </div>

                    {/* Publié */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="published"
                                checked={formData.published}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-sm font-semibold">Publier cet article</span>
                        </label>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner className="w-4 h-4 mr-2" />
                                    Enregistrement...
                                </>
                            ) : article ? (
                                "Modifier"
                            ) : (
                                "Créer"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
