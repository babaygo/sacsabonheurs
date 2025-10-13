"use client";

import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Product } from "@/types/Product";
import ProductFilters from "@/components/ProductsFilters";
import { SortOption } from "@/types/SortOptions";
import PreviewProduct from "@/components/PreviewProduct";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);

    useEffect(() => {
        fetch(`${getBaseUrl()}/api/categories/${slug}/products`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data) {
                    notFound();
                } else {
                    setProducts(data);
                }
            });
    }, []);

    const sorted = products.sort((a, b) => {
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
        <div>
            <div className="px-4">
                <ProductFilters
                    selectedCategory={selectedCategory}
                    sortOption={sortOption}
                    onCategoryChange={setSelectedCategory}
                    onSortChange={setSortOption}
                    showCategoryFilter={false}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sorted.map((product: Product) => (
                    <PreviewProduct key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
