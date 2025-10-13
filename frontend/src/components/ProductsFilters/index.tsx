"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/lib/categoryStore";
import { Category } from "@/types/Category";
import { SortOption } from "@/types/SortOptions";



interface ProductFiltersProps {
    selectedCategory: string;
    sortOption: SortOption;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: SortOption) => void;
    showCategoryFilter?: boolean;
}

export default function ProductFilters({
    selectedCategory,
    sortOption,
    onCategoryChange,
    onSortChange,
    showCategoryFilter = true,
}: ProductFiltersProps) {
    const categories: Category[] = useCategoryStore((state) => state.categories) ?? [];

    return (
        <div className="flex flex-wrap gap-4 mb-8">
            {showCategoryFilter && (
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date-desc">Ajout récent</SelectItem>
                    <SelectItem value="date-asc">Ajout ancien</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="name-asc">Nom A → Z</SelectItem>
                    <SelectItem value="name-desc">Nom Z → A</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
