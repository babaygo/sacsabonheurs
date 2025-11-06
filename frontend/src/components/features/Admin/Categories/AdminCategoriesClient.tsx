"use client";

import { useEffect } from "react";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AddCategoryDialog } from "@/components/shared/Dialogs/CategoryAddDialog";
import { EditCategoryDialog } from "@/components/shared/Dialogs/CategoryEditDialog";
import { DeleteCategoryDialog } from "@/components/shared/Dialogs/CategoryDeleteDialog";
import { Category } from "@/types/Category";
import { useCategories } from "@/hooks/useCategories";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

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

    if (loadingUser || loading) return <Spinner className="min-h-screen" />;
    if (error) { toast.error(error); }

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
