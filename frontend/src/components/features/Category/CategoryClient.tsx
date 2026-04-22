"use client";

import { useState } from "react";
import { SortOption } from "@/lib/constants/SortOptions";
import ProductFilters from "../Product/ProductsFilters/ProductFilters";
import PreviewProduct from "../Product/PreviewProduct";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { useProductList } from "@/hooks/useProductList";
import BreadCrumb from "@/components/shared/BreadCrumb";

export default function CategoryPageClient({
    category,
    initialProducts,
    categorySlug,
}: {
    category: { name: string };
    initialProducts: Product[];
    categorySlug: string;
}) {
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);

    const { sorted, page, setPage, hasMore } = useProductList({
        initialProducts,
        categorySlug,
        selectedMaterial,
        sortOption,
    });

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique", href: "/boutique" },
                    { label: category.name },
                ]}
            />
            <h1>{category.name}</h1>
            <ProductFilters
                selectedCategory={null}
                selectedMaterial={selectedMaterial}
                sortOption={sortOption}
                onCategoryChange={() => {}}
                onMaterialChange={setSelectedMaterial}
                onSortChange={setSortOption}
                showCategoryFilter={false}
                showMaterialFilter={false}
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
