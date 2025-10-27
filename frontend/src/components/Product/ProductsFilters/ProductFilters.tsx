"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorView } from "@/components/Views/ErrorView";
import { LoadingView } from "@/components/Views/LoadingView";
import { useCategories } from "@/lib/useCategories";
import { Category } from "@/types/Category";
import { SortOption } from "@/types/SortOptions";

interface ProductFiltersProps {
    selectedCategory: string | null;
    sortOption: SortOption | null;
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
    const { categories, loading, error } = useCategories();

    const sortLabels: Record<SortOption, string> = {
        "date-desc": "Ajout récent",
        "date-asc": "Ajout ancien",
        "price-asc": "Prix croissant",
        "price-desc": "Prix décroissant",
        "name-asc": "Nom A → Z",
        "name-desc": "Nom Z → A",
    };

    if (error) return <ErrorView error={error} />;
    if (loading) return <LoadingView />;

    return (
        <div className="flex gap-4 mb-8">
            {showCategoryFilter && (
                <Select
                    value={selectedCategory ?? undefined}
                    onValueChange={onCategoryChange}
                >
                    <SelectTrigger className="w-[200px]" aria-label="Filtrer par catégorie">
                        <SelectValue placeholder="Catégories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.length > 0 ? (
                            categories.map((category: Category) => (
                                <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="all" disabled>
                                Aucune catégorie
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            )}

            <Select
                value={sortOption ?? undefined}
                onValueChange={(v) => onSortChange(v as SortOption)}
            >
                <SelectTrigger className="w-[200px]" aria-label="Trier les produits">
                    <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(sortLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
