"use client";

import { useEffect, useState } from "react";
import { Article } from "@/types/Article";
import { getAdminArticles, createArticle, updateArticle, deleteArticle } from "@/lib/api/article";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Plus } from "lucide-react";
import { ArticleDialog } from "../../../shared/Dialogs/ArticleDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteArticleDialog } from "@/components/shared/Dialogs/ArticleDeleteDialog";

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
                await updateArticle(editingArticle.id, articleData, editingArticle.slug);
            } else {
                await createArticle(articleData);
            }
            await loadArticles();
            handleCloseDialog();
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
        <div className="min-h-screen pt-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl sm:text-4xl font-bold">Articles</h1>
                <Button variant="outline" onClick={() => handleOpenDialog()}>
                    <Plus />
                    Ajouter un article
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
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Publié</TableHead>
                            <TableHead>Créé</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="truncate">
                                    {article.title}
                                </TableCell>
                                <TableCell>
                                    {article.slug}
                                </TableCell>
                                <TableCell>
                                    {article.category}
                                </TableCell>
                                <TableCell>
                                    {article.published ? "Publié" : "Brouillon"}
                                </TableCell>
                                <TableCell>
                                    {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenDialog(article)}
                                    >
                                        Modifier
                                    </Button>
                                    <DeleteArticleDialog article={article} onSuccess={loadArticles} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
