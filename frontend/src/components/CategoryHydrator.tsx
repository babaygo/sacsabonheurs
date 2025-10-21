"use client";

import { useCategories } from "@/lib/useCategories";

export function CategoryHydrator() {
    useCategories();
    return null;
}