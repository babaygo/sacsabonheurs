"use client";

import { useEffect } from "react";
import { useSessionContext } from "@/components/SessionProvider";
import { useRouter } from "next/navigation";
import { ErrorView } from "@/components/Views/ErrorView";
import { LoadingView } from "@/components/Views/LoadingView";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AddCategoryDialog } from "@/components/Dialogs/CategoryAddDialog";
import { EditCategoryDialog } from "@/components/Dialogs/CategoryEditDialog";
import { DeleteCategoryDialog } from "@/components/Dialogs/CategoryDeleteDialog";
import { Category } from "@/types/Category";
import { useCategories } from "@/lib/useCategories";

export default function AdminCategoriesClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();

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

    if (loadingUser || loading) return <LoadingView />;
    if (error) return <ErrorView error={error} />;

    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Catégories</h1>
                    <AddCategoryDialog onSuccess={refreshCategories} />
                </div>

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
                                        <EditCategoryDialog
                                            category={category}
                                            onSuccess={refreshCategories}
                                        />
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
