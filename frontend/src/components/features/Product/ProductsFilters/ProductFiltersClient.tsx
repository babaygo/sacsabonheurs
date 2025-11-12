"use client";

import { useEffect, useMemo, useState } from "react";
import { SortOption } from "@/lib/constants/SortOptions";
import ProductFilters from "./ProductFilters";
import PreviewProduct from "../PreviewProduct";
import { Product } from "@/types/Product";
import { useProductsContext } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";

export default function ProductFiltersClient({ initialProducts }: { initialProducts: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);
    const { products: liveProducts, hasMore, fetchProducts } = useProductsContext();

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchProducts(24, true, 0);
    }, [fetchProducts]);

    useEffect(() => {
        if (page === 0) return;
        const skip = page * 24;
        fetchProducts(24, true, skip);
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

    const filtered =
        !selectedCategory || selectedCategory === "all"
            ? products
            : products.filter((p) => p.category?.name === selectedCategory);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (!sortOption) return 0;
            switch (sortOption) {
                case "price-asc": return a.price - b.price;
                case "price-desc": return b.price - a.price;
                case "name-asc": return a.name.localeCompare(b.name);
                case "name-desc": return b.name.localeCompare(a.name);
                case "date-asc": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "date-desc": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default: return 0;
            }
        });
    }, [filtered, sortOption]);

    return (
        <div className="pt-4">
            <ProductFilters
                selectedCategory={selectedCategory}
                sortOption={sortOption}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortOption}
                showCategoryFilter={true}
            />

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6">
                {sorted.map((product) => (
                    <PreviewProduct key={`product-${product.id}`} product={product} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Voir plus
                    </Button>
                </div>
            )}
        </div>
    );
}
