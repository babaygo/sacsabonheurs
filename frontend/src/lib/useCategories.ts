import { useEffect, useState } from "react";
import { useCategoryStore } from "./categoryStore";

export function useCategories() {
    const { categories, setCategories, hasFetched, setHasFetched } = useCategoryStore();
    const [loadingCategories, setLoading] = useState(!hasFetched);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        if (hasFetched) return;

        let cancelled = false;

        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Erreur serveur");
                const data = await res.json();
                if (!cancelled) {
                    setCategories(data);
                    setHasFetched(true);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Impossible de charger les catégories");
                    setCategories([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchCategories();
        return () => {
            cancelled = true;
        };
    }, [hasFetched]);

    return { categories, loadingCategories, error };
}
