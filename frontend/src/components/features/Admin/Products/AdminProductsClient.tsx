"use client";

import { useSessionContext } from "@/components/shared/SessionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddDialog } from "@/components/shared/Dialogs/ProductAddDialog";
import { EditDialog } from "@/components/shared/Dialogs/ProductEditDialog";
import { DeleteDialog } from "@/components/shared/Dialogs/ProductDeleteDialog";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useCategories } from "@/hooks/useCategories";

export default function AdminProducts() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const { products, refetch } = useProductsContext();
    const { categories } = useCategories();

    useEffect(() => {
        if (!loadingUser && user?.role !== "admin") {
            router.push("/");
        }
    }, [user, loadingUser, router]);

    if (loadingUser) return null;

    if (!products || products.length === 0) {
        return <div className="text-center py-10">Aucun produit disponible.</div>;
    }

    return (
        <div className="min-h-screen pt-4 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Produits</h1>
                <AddDialog categories={categories} onSuccess={refetch} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="p-4 bg-white rounded shadow-sm space-y-2 flex flex-col justify-between"
                    >
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h2 className="text-lg font-semibold">{product.name}</h2>

                        <div className="flex flex-wrap gap-2 mt-2">
                            <EditDialog product={product} categories={categories} onSuccess={refetch} />
                            <DeleteDialog productId={product.id} onSuccess={refetch} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
