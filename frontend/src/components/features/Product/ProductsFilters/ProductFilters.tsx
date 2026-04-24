"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/Category";
import { SortOption } from "@/lib/constants/SortOptions";
import { useEffect, useState } from "react";
import { getCollections } from "@/lib/api/collection";
import { Collection } from "@/types/Collection";

interface ProductFiltersProps {
    selectedCategory: string | null;
    selectedCollection: string | null;
    sortOption: SortOption | null;
    onCategoryChange: (value: string) => void;
    onCollectionChange: (value: string) => void;
    onSortChange: (value: SortOption | null) => void;
    showCategoryFilter?: boolean;
    showCollectionFilter?: boolean;
}

const sortLabels: Record<SortOption, string> = {
    "date-desc": "Ajout récent",
    "date-asc": "Ajout ancien",
    "price-asc": "Prix croissant",
    "price-desc": "Prix décroissant",
    "name-asc": "Nom A → Z",
    "name-desc": "Nom Z → A",
};

export default function ProductFilters({
    selectedCategory,
    selectedCollection,
    sortOption,
    onCategoryChange,
    onCollectionChange,
    onSortChange,
    showCategoryFilter = true,
    showCollectionFilter = true,
}: ProductFiltersProps) {
    const { categories, loading, error } = useCategories();
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        getCollections().then(setCollections);
    }, []);

    if (error) return error;
    if (loading) return null;

    const CategoryFilter = ({ className = "" }: { className?: string }) => (
        <Select value={selectedCategory ?? undefined} onValueChange={onCategoryChange}>
            <SelectTrigger className={className} aria-label="Filtrer par catégorie">
                <SelectValue placeholder="Catégories" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.length > 0 ? (
                    categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="all" disabled>Aucune catégorie</SelectItem>
                )}
            </SelectContent>
        </Select>
    );

    const CollectionFilter = ({ className = "" }: { className?: string }) => (
        <Select value={selectedCollection ?? undefined} onValueChange={onCollectionChange}>
            <SelectTrigger className={className} aria-label="Filtrer par collection">
                <SelectValue placeholder="Collections" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Toutes les collections</SelectItem>
                {collections.length > 0 ? (
                    collections.map((col: Collection) => (
                        <SelectItem key={col.id} value={String(col.id)}>
                            {col.title}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="all" disabled>Aucune collection</SelectItem>
                )}
            </SelectContent>
        </Select>
    );

    const SortFilter = ({ className = "", showReset = false }: { className?: string; showReset?: boolean }) => (
        <div className="relative">
            <Select value={sortOption ?? undefined} onValueChange={(v) => onSortChange(v as SortOption)}>
                <SelectTrigger className={className} aria-label="Trier les produits">
                    <SelectValue placeholder="Trier les produits" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(sortLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {showReset && sortOption && (
                <Button
                    variant="link"
                    size="icon"
                    className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-transparent"
                    onClick={() => onSortChange(null)}
                    aria-label="Réinitialiser le tri"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );

    return (
        <div className="mb-2">
            <div className="hidden md:flex gap-4">
                {showCategoryFilter && <CategoryFilter className="w-[200px]" />}
                {showCollectionFilter && <CollectionFilter className="w-[200px]" />}
                <SortFilter className="w-[200px]" showReset />
            </div>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="link" className="flex justify-start p-0 text-base font-semibold">
                            <SlidersHorizontal className="mr-2" />
                            Filtres et tri
                        </Button>
                    </SheetTrigger>
                    <Separator className="mt-2" />

                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Filtres et tri</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-6 mt-6">
                            {showCategoryFilter && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Filtrer par catégorie</label>
                                    <CategoryFilter className="w-full" />
                                </div>
                            )}
                            {showCollectionFilter && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Filtrer par collection</label>
                                    <CollectionFilter className="w-full" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Trier par</label>
                                <SortFilter className="w-full" showReset />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}