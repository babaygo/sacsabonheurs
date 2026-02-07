"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { CategoryDialog } from "@/components/shared/Dialogs/CategoryDialog";
import { DeleteCategoryDialog } from "@/components/shared/Dialogs/CategoryDeleteDialog";
import { Category } from "@/types/Category";
import { useCategories } from "@/hooks/useCategories";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const {
        categories,
        loading,
        error,
        refreshCategories,
    } = useCategories();

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, loadingUser, router]);

    if (loadingUser || loading) return <Spinner className="min-h-screen" />;
    if (error) { toast.error(error); }

    const handleAdd = () => {
        setSelectedCategory(null);
        setOpenDialog(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setOpenDialog(true);
    };

    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <div className="flex justify-between">
                    <h1 className="text-3xl sm:text-4xl font-bold">Catégories</h1>
                    <Button variant="outline" onClick={handleAdd}>
                        <Plus />
                        Ajouter une catégorie
                    </Button>
                </div>

                <CategoryDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    category={selectedCategory}
                    onSave={refreshCategories}
                />

                {categories.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category: Category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.slug}</TableCell>
                                    <TableCell>{category.products?.length}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            variant="outline"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Modifier
                                        </Button>
                                        <DeleteCategoryDialog
                                            category={category}
                                            onSuccess={refreshCategories}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>Aucune catégorie disponible.</p>
                )}
            </div>
        </div>
    );
}
