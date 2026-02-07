"use client";

import { useSessionContext } from "@/components/shared/SessionProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDialog } from "@/components/shared/Dialogs/ProductDialog";
import { DeleteProductDialog } from "@/components/shared/Dialogs/ProductDeleteDialog";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useCategories } from "@/hooks/useCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/Product";

export default function AdminProducts() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const { products: liveProducts, hasMore, fetchProducts } = useProductsContext();
    const { categories } = useCategories();

    const [filter, setFilter] = useState("all");
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!loadingUser && user?.role !== "admin") {
            router.push("/");
        }
    }, [user, loadingUser, router]);

    useEffect(() => {
        fetchProducts(24, false, 0);
    }, [fetchProducts]);

    useEffect(() => {
        if (page === 0) return;
        const skip = page * 24;
        fetchProducts(24, false, skip);
    }, [page, fetchProducts]);

    useEffect(() => {
        if (!liveProducts) return;
        if (page === 0) {
            setProducts(liveProducts);
        } else {
            setProducts((prev) => {
                const seen = new Set(prev.map((p) => p.id));
                const uniqueNew = liveProducts.filter((p) => !seen.has(p.id));
                return [...prev, ...uniqueNew];
            });
        }
    }, [liveProducts, page]);

    if (loadingUser) return null;

    const handleAdd = () => {
        setSelectedProduct(null);
        setOpenDialog(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleRefresh = () => {
        setPage(0);
        fetchProducts(24, false, 0);
    };

    const filteredProducts = products.filter((product) => {
        if (filter === "rupture-stock") return product.stock < 1;
        if (filter === "hidden") return product.hidden === true;
        return true;
    });

    return (
        <div className="min-h-screen pt-4 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold">Produits</h1>
                <Button variant="outline" onClick={handleAdd}>
                    <Plus />
                    Ajouter un sac
                </Button>
            </div>

            <ProductDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                product={selectedProduct}
                categories={categories}
                onSave={handleRefresh}
            />

            <div className="mb-8">
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[200px]" aria-label="Filtrer les produits">
                        <SelectValue placeholder="Filtres" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les produits</SelectItem>
                        <SelectItem value="rupture-stock">Rupture de stock</SelectItem>
                        <SelectItem value="hidden">Masqués sur la boutique</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(product)}
                                    className="w-full"
                                >
                                    Modifier
                                </Button>

                                <DeleteProductDialog
                                    productId={product.id}
                                    onSuccess={handleRefresh}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 col-span-full">Aucun produit disponible.</div>
                )}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-6">
                    <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
                        Voir plus
                    </Button>
                </div>
            )}
        </div>
    );
}
