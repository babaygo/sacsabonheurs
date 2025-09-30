import { create } from "zustand";

interface CategoryStore {
    categories: any[];
    setCategories: (cats: any[]) => void;
    hasFetched: boolean;
    setHasFetched: (v: boolean) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    setCategories: (cats) => set({ categories: cats }),
    hasFetched: false,
    setHasFetched: (v) => set({ hasFetched: v }),
}));
