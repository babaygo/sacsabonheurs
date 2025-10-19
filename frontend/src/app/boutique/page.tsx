"use client";

import BreadCrumb from "@/components/BreadCrumb";
import PreviewProduct from "@/components/PreviewProduct";
import ProductFilters from "@/components/ProductsFilters";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Product } from "@/types/Product";
import { SortOption } from "@/types/SortOptions";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoutiquePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption | null>(null);

    useEffect(() => {
        fetch(`${getBaseUrl()}/api/products`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data) {
                    notFound();
                } else {
                    setProducts(data);
                }
            });
    }, []);

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
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique" }
                ]}
            />
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
        </div>
    );
}
