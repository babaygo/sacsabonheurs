"use client";

import ProductFilters from "@/components/ProductsFilters";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Product } from "@/types/Product";
import { SortOption } from "@/types/SortOptions";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoutiquePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortOption, setSortOption] = useState<SortOption>("date-desc");

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

    const filtered = selectedCategory === "all"
        ? products
        : products.filter((p) => p.category?.name === selectedCategory);

    const sorted = [...filtered].sort((a, b) => {
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
        <main>
            <ProductFilters
                selectedCategory={selectedCategory}
                sortOption={sortOption}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortOption}
                showCategoryFilter={true}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {sorted.map((product) => (
                    <div key={product.id} className="flex flex-col items-center p-4 group">
                        <div className="relative w-full h-100 bg-white rounded overflow-hidden">
                            <img
                                src={product.images?.[0] ?? "/placeholder.jpg"}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                            />
                            {product.images?.[1] && (
                                <img
                                    src={product.images[1]}
                                    alt={`${product.name} - vue secondaire`}
                                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                />
                            )}
                        </div>

                        <h3 className="font-montserrat mt-4">{product.name}</h3>
                        <p className="font-montserrat text-sm font-semibold mt-2">{product.price.toFixed(2)} €</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
