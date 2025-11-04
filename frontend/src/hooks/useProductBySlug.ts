import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export function useProductBySlug(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [errorProduct, setErrorProduct] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        async function fetchProduct() {
            try {
                const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, { cache: "no-store" });
                if (!res.ok) {
                    return null;
                }
                const data = await res.json();
                setProduct(data);
            } catch (err: any) {
                setErrorProduct(err.message || "Erreur inconnue");
            } finally {
                setLoadingProduct(false);
            }
        }

        fetchProduct();
    }, [slug]);

    return { product, loadingProduct, errorProduct };
}
