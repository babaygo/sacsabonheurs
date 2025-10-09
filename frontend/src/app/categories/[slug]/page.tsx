"use client";

import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import Link from "next/link";

async function getProductsByCategory(slug: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${slug}/products`);
    if (!res.ok) return null;
    return res.json();
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [products, setProducts] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [priceMax, setPriceMax] = useState<number | null>(null);
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        getProductsByCategory(slug).then((data) => {
            if (!data) {
                notFound();
            } else {
                setProducts(data);
                setFiltered(data);
            }
        });
    }, [slug]);

    useEffect(() => {
        let result = [...products];
        if (priceMax !== null) {
            result = result.filter((p) => p.price <= priceMax);
        }
        if (inStockOnly) {
            result = result.filter((p) => p.stock > 0);
        }
        setFiltered(result);
    }, [priceMax, inStockOnly, products]);

    return (
        <div className="max-w-7xl mx-auto min-h-screen px-4 py-8">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                Filtres :
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    En stock uniquement
                </label>
                <label className="flex items-center gap-2">
                    Prix max :
                    <input
                        type="number"
                        value={priceMax ?? ""}
                        onChange={(e) => setPriceMax(e.target.value ? parseFloat(e.target.value) : null)}
                        className="border px-2 py-1 rounded w-24"
                    />
                </label>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {filtered.map((p) => (
                    <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="flex flex-col items-center hover:opacity-75 p-4 h-[400px] justify-between"
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            <img
                                src={JSON.parse(p.images)[0]}
                                alt={p.name}
                                className="max-h-64 object-contain"
                            />
                        </div>
                        <h2 className="mt-2 text-center">{p.name}</h2>
                        <p className="text-muted-foreground">{p.price} €</p>
                    </Link>
                ))}
            </div>

        </div>
    );
}
