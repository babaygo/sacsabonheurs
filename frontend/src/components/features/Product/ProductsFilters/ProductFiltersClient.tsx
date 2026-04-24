"use client";

import { useState } from "react";
import { SortOption } from "@/lib/constants/SortOptions";
import ProductFilters from "./ProductFilters";
import PreviewProduct from "../PreviewProduct";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { useProductList } from "@/hooks/useProductList";

export default function ProductFiltersClient({ initialProducts }: { initialProducts: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);

    const { sorted, page, setPage, hasMore } = useProductList({
        initialProducts,
        categorySlug: selectedCategory,
        selectedCollection,
        sortOption,
    });

    return (
        <div className="pt-4">
            <ProductFilters
                selectedCategory={selectedCategory}
                selectedCollection={selectedCollection}
                sortOption={sortOption}
                onCategoryChange={setSelectedCategory}
                onCollectionChange={setSelectedCollection}
                onSortChange={setSortOption}
                showCategoryFilter={true}
                showCollectionFilter={true}
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
