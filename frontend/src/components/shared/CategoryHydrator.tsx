"use client";

import { useCategories } from "@/hooks/useCategories";

export function CategoryHydrator() {
    useCategories();
    return null;
}