"use client";

import { useEffect, useState } from "react";
import { Article } from "@/types/Article";
import { getAdminArticles, createArticle, updateArticle, deleteArticle } from "@/lib/api/blog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Edit2, Trash2, Plus } from "lucide-react";
import { ArticleDialog } from "../../../shared/Dialogs/ArticleDialog";

export default function AdminArticlesClient() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            setLoading(true);
            const data = await getAdminArticles();
            setArticles(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des articles");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (article?: Article) => {
        setEditingArticle(article || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingArticle(null);
    };

    const handleSaveArticle = async (articleData: any) => {
        try {
            if (editingArticle) {
                await updateArticle(editingArticle.id, articleData);
            } else {
                await createArticle(articleData);
            }
            await loadArticles();
            handleCloseDialog();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteArticle = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

        try {
            await deleteArticle(id);
            await loadArticles();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Gestion des Articles</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel article
                </Button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {articles.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Aucun article trouvé</p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer le premier article
                    </Button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="px-4 py-2 text-left font-semibold">Titre</th>
                                <th className="px-4 py-2 text-left font-semibold">Slug</th>
                                <th className="px-4 py-2 text-left font-semibold">Catégorie</th>
                                <th className="px-4 py-2 text-left font-semibold">Publié</th>
                                <th className="px-4 py-2 text-left font-semibold">Créé</th>
                                <th className="px-4 py-2 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium max-w-xs truncate">
                                        {article.title}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {article.slug}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                article.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {article.published ? "Publié" : "Brouillon"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenDialog(article)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteArticle(article.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ArticleDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                article={editingArticle}
                onSave={handleSaveArticle}
            />
        </div>
    );
}
