"use client";

import { getBaseUrl } from "@/lib/getBaseUrl";
import { Category } from "@/types/Category";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

async function getFisrtProductsByCategory() {
    const res = await fetch(
        `${getBaseUrl()}/api/categories/first-product-by-category`, {
        credentials: "include"
    });
    if (!res.ok) return null;
    return res.json();
}

export default function BoutiquePage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        getFisrtProductsByCategory().then((data) => {
            if (!data) {
                notFound();
            } else {
                setCategories(data);
            }
        });
    }, []);

    return (
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Types de sacs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat: Category) => {
                    const product = cat.products[0];
                    if (!product) return null;

                    return (
                        <a
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group border rounded-lg p-4 hover:shadow transition"
                        >
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded"
                            />
                            <h2 className="mt-2 text-xl font-semibold">{cat.name}</h2>
                        </a>
                    );
                })}
            </div>
        </main>
    );
}
