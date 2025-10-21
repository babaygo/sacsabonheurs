"use client";

import { useState } from "react";

import { Product } from "@/types/Product";
import { SortOption } from "@/types/SortOptions";
import ProductFilters from "./ProductFilters";
import PreviewProduct from "../PreviewProduct";

export default function ProductFiltersClient({ products }: { products: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);

    const filtered = !selectedCategory || selectedCategory === "all"
        ? products
        : products.filter((p) => p.category?.name === selectedCategory);

    const sorted = [...filtered].sort((a, b) => {
        if (!sortOption) return 0;
        switch (sortOption) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "date-asc":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "date-desc":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
                return 0;
        }
    });

    return (
        <>
            <ProductFilters
                selectedCategory={selectedCategory}
                sortOption={sortOption}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortOption}
                showCategoryFilter={true}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {sorted.map((product) => (
                    <PreviewProduct key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}
