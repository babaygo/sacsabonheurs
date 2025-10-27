import { useEffect } from "react";
import { useCategoriesStore } from "./useCategoriesStore";

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
