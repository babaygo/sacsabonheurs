"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

type ProductsContextType = {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${getBaseUrl()}/api/products`, { cache: "no-store", credentials: "include" });
            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            const data = await res.json();
            setProducts(data);
        } catch (err: any) {
            setError(err.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refetch();
    }, []);

    return (
        <ProductsContext.Provider value={{ products, loading, error, refetch }}>
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
