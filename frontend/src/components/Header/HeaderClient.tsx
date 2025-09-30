"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/authStore";
import { useCategories } from "@/lib/useCategories";

export default function HeaderClient() {
    const user = useAuthStore((s) => s.user);
    const { categories, loading, error } = useCategories();

    return (
        <header className="bg-white">
            {loading && <p>Chargement des catégories...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo Sacs à Bonheur" className="h-10 w-10" />
                    <Link href="/" className="text-xl">Sacs à Bonheur</Link>
                </div>

                <nav className="hidden md:flex space-x-8">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/categories/${cat.slug}`}>
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingCartIcon className="size-6 text-gray-400 group-hover:text-gray-500" />
                </Link>

                {user ? (
                    <Link href="/profile">Mon compte</Link>
                ) : (
                    <Link href="/login">Se connecter</Link>
                )}
            </div>
        </header>
    );
}