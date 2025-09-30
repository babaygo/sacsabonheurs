"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/authStore";
import { useCategories } from "@/lib/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { Separator } from "../ui/separator";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";

export default function HeaderClient() {
    const user: User = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const { categories, loading, error } = useCategories();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        setUser(null);
        router.push("/");
    };

    return (
        <header className="bg-white">
            <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo Sacs à Bonheur" className="h-10 w-10" />
                    <Link href="/" className="text-xl">Sacs à Bonheur</Link>
                </div>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-24 rounded" />
                    ))
                    : categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="text-gray-700 hover:text-black"
                        >
                            {cat.name}
                        </Link>
                    ))}

                <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingCartIcon className="size-6 text-gray-400 group-hover:text-gray-500" />
                </Link>

                {user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="link">Mon compte</Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-small">
                                        {user.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <Separator />
                                <div className="grid gap-2">
                                    <div className="grid items-center p-2 rounded hover:bg-gray-100">
                                        <Link href="/profile" className="text-sm">Profil</Link>
                                    </div>
                                    <div className="grid items-center p-2 rounded hover:bg-gray-100">
                                        <Link href="/orders" className="text-sm">Mes commandes</Link>
                                    </div>
                                    <div className="grid items-center p-2 rounded">
                                        <Button variant='default' onClick={handleLogout} className="text-sm">Se déconnecter</Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Link href="/login">Se connecter</Link>
                )}
            </div>
        </header>
    );
}