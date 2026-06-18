"use client";

import { useState } from "react";
import { SortOption } from "@/lib/constants/SortOptions";
import ProductFilters from "../Product/ProductsFilters/ProductFilters";
import CollectionTabs from "../Product/ProductsFilters/CollectionTabs";
import PreviewProduct from "../Product/PreviewProduct";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";
import { useProductList } from "@/hooks/useProductList";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { getCategoryContent } from "@/lib/seo/categoryContent";

export default function CategoryPageClient({
    category,
    initialProducts,
    categorySlug,
}: {
    category: { name: string };
    initialProducts: Product[];
    categorySlug: string;
}) {
    const { heading, intro } = getCategoryContent(categorySlug, category.name);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);
    const [hideOutOfStock, setHideOutOfStock] = useState(false);

    const { sorted, products, page, setPage, hasMore } = useProductList({
        initialProducts,
        categorySlug,
        selectedCollection,
        sortOption,
        hideOutOfStock,
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
            <header className="mb-8 max-w-4xl">
                <h1 className="mb-4">{heading}</h1>
                <div className="space-y-3 text-body leading-relaxed text-foreground/80">
                    {intro.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>
            </header>
            <CollectionTabs
                value={selectedCollection}
                onChange={setSelectedCollection}
                products={products}
                className="mb-4"
            />

            <ProductFilters
                selectedCategory={null}
                selectedCollection={selectedCollection}
                sortOption={sortOption}
                onCategoryChange={() => {}}
                onCollectionChange={setSelectedCollection}
                onSortChange={setSortOption}
                showCategoryFilter={false}
                showCollectionFilter={false}
                showStockToggle={true}
                hideOutOfStock={hideOutOfStock}
                onHideOutOfStockChange={setHideOutOfStock}
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
