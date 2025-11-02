import { create } from "zustand";
import { Category } from "@/types/Category";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

interface CategoriesStore {
    categories: Category[];
    hasFetched: boolean;
    loading: boolean;
    error: string | null;
    setCategories: (cats: Category[]) => void;
    refreshCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
    categories: [],
    hasFetched: false,
    loading: false,
    error: null,
    setCategories: (cats) => set({ categories: cats }),
    refreshCategories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${getBaseUrl()}/api/categories`, {
                credentials: "include",
                cache: "no-store"
            });
            if (!res.ok) {
                const msg = await res.text();
                set({ error: msg, loading: false });
                return;
            }
            const data = await res.json();
            set({ categories: data, hasFetched: true, loading: false });
        } catch (err: any) {
            set({ error: err.message || "Erreur inconnue", loading: false });
        }
    },
}));
