import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/Product";
import { SortOption } from "@/lib/constants/SortOptions";
import { useProductsContext } from "@/contexts/ProductsContext";

interface UseProductListOptions {
    initialProducts: Product[];
    categorySlug?: string | null;
    selectedCollection: string | null;
    sortOption: SortOption | null;
}

export function useProductList({
    initialProducts,
    categorySlug,
    selectedCollection,
    sortOption,
}: UseProductListOptions) {
    const { products: liveProducts, hasMore, fetchProducts } = useProductsContext();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setPage(0);
        fetchProducts(24, true, 0, undefined, categorySlug || undefined);
    }, [categorySlug, fetchProducts]);

    useEffect(() => {
        if (page === 0) return;
        fetchProducts(24, true, page * 24, undefined, categorySlug || undefined);
    }, [page, fetchProducts]);

    useEffect(() => {
        if (!liveProducts) return;

        if (page === 0) {
            setProducts(liveProducts);
        } else {
            setProducts((prev) => {
                const seen = new Set(prev.map((p) => p.id));
                const uniqueNew = liveProducts.filter((p) => !seen.has(p.id));
                return [...prev, ...uniqueNew];
            });
        }
    }, [liveProducts, page]);

    const sorted = useMemo(() => {
        let result = products;

        if (categorySlug && categorySlug !== "all") {
            result = result.filter((p) => p.category?.slug === categorySlug);
        }

        if (selectedCollection && selectedCollection !== "all") {
            const colId = parseInt(selectedCollection);
            result = result.filter((p) => p.collectionId === colId);
        }

        if (!sortOption) return result;

        return [...result].sort((a, b) => {
            switch (sortOption) {
                case "price-asc": return a.price - b.price;
                case "price-desc": return b.price - a.price;
                case "name-asc": return a.name.localeCompare(b.name);
                case "name-desc": return b.name.localeCompare(a.name);
                case "date-asc": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "date-desc": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default: return 0;
            }
        });
    }, [products, categorySlug, selectedCollection, sortOption]);

    return { sorted, page, setPage, hasMore };
}
