"use client";

import { notFound } from "next/navigation";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getProductsByCategory(slug: string) {
    const res = await fetch(
        `${getBaseUrl()}/api/categories/${slug}/products`, {
            credentials: "include"
        });
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((p) => (
                    <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="group p-4 flex flex-col justify-between h-[400px] hover:transition"
                    >
                        <div className="flex-1 flex items-center justify-center">
                            <img
                                src={JSON.parse(p.images)[0]}
                                alt={p.name}
                                className="max-h-64 object-contain transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <h2 className="text-sm font-montserrat font-medium">{p.name}</h2>
                            <p className="text-sm font-mono font-bold ">{p.price} €</p>
                        </div>
                    </Link>
                ))}
            </div>


        </div>
    );
}
