"use client";

import { useEffect, useState } from "react";
import { getCollections } from "@/lib/api/collection";
import { Collection } from "@/types/Collection";
import { Product } from "@/types/Product";
import { cn } from "@/lib/utils/utils";

interface CollectionTabsProps {
    value: string | null;
    onChange: (value: string | null) => void;
    products?: Product[];
    allLabel?: string;
    className?: string;
}

function toLabel(material: string, fallback: string) {
    const base = (material || fallback || "").trim();
    if (!base) return fallback;
    return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function CollectionTabs({
    value,
    onChange,
    products,
    allLabel = "Toutes",
    className = "",
}: CollectionTabsProps) {
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        let active = true;
        getCollections().then((cols) => {
            if (active) setCollections([...cols].sort((a, b) => a.order - b.order));
        });
        return () => {
            active = false;
        };
    }, []);

    let visibleCollections = collections;
    if (products) {
        const presentIds = new Set(
            products.map((p) => p.collectionId).filter((id): id is number => id != null),
        );
        visibleCollections = collections.filter((c) => presentIds.has(c.id));
    }

    if (visibleCollections.length < 2) return null;

    const tabs: { id: string | null; label: string }[] = [
        { id: null, label: allLabel },
        ...visibleCollections.map((c) => ({ id: String(c.id), label: toLabel(c.material, c.title) })),
    ];

    const isActive = (id: string | null) =>
        (value ?? null) === id || (id === null && value === "all");

    return (
        <div
            className={cn(
                "flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap",
                className,
            )}
            role="tablist"
            aria-label="Filtrer par collection"
        >
            {tabs.map((tab) => {
                const active = isActive(tab.id);
                return (
                    <button
                        key={tab.id ?? "all"}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors border",
                            active
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary/40 text-foreground border-transparent hover:bg-secondary",
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
