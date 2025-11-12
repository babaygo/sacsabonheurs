"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Product } from "@/types/Product";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

type ProductsContextType = {
    products: Product[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    fetchProducts: (limit?: number, visibleOnly?: boolean, skip?: number, sort?: string) => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);

    const fetchProducts = useCallback(
        async (limit?: number, visibleOnly?: boolean, skip?: number, sort?: string) => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (limit) params.append("limit", String(limit));
                if (visibleOnly) params.append("visibleOnly", "true");
                if (skip) params.append("skip", String(skip));
                if (sort) params.append("sort", sort);

                const res = await fetch(`${getBaseUrl()}/api/products?${params.toString()}`, {
                    cache: "no-store",
                    credentials: "include",
                });

                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                const data = await res.json();

                setProducts(data.products || []);
                setHasMore(data.hasMore ?? false);
            } catch (err: any) {
                setError(err.message || "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return (
        <ProductsContext.Provider value={{ products, loading, error, hasMore, fetchProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProductsContext() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProductsContext must be used within a ProductsProvider");
    }
    return context;
}
