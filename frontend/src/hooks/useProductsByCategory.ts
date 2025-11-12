import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export function useProductsByCategory(categoryId: number) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorProducts, setErrorProducts] = useState<string | null>(null);

    useEffect(() => {
        if (!categoryId) return;

        async function fetchProductsByCategory() {
            try {
                const res = await fetch(`${getBaseUrl()}/api/products/category/${categoryId}`, { cache: "no-store" });
                if (!res.ok) {
                    return [];
                }
                const data = await res.json();
                setProducts(data);
            } catch (err: any) {
                setErrorProducts(err.message || "Erreur inconnue");
            } finally {
                setLoadingProducts(false);
            }
        }

        fetchProductsByCategory();
    }, [categoryId]);

    return { products, loadingProducts, errorProducts };
}
