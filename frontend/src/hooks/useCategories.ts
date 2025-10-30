import { useEffect } from "react";
import { useCategoriesStore } from "../lib/stores/categoriesStore";

export function useCategories() {
    const {
        categories,
        hasFetched,
        loading,
        error,
        refreshCategories,
    } = useCategoriesStore();

    useEffect(() => {
        if (!hasFetched) {
            refreshCategories();
        }
    }, [hasFetched, refreshCategories]);

    return { categories, loading, error, refreshCategories };
}
