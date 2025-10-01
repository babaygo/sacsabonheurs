"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { useCategories } from "@/lib/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/authClient";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/lib/useCart";


export default function HeaderClient() {
    const user: User = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const { categories, loading } = useCategories();
    const router = useRouter();
    const { setOpen, count } = useCart();

    const handleLogout = async () => {
        await authClient.signOut();
        setUser(null);
        router.push("/");
    };

    return (
        <header className="bg-white w-full border-b">
            <div className="flex p-4 h-full items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <img src="/logo.png" alt="Logo Sacs à Bonheur" />
                    <Link href="/" className="text-xl font-semibold">Sacs à Bonheur</Link>
                </div>

                {/* Catégories */}
                <div className="flex space-x-6">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-24 rounded" />
                        ))
                        : categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="text-gray-700 hover:text-black text-sm"
                            >
                                {cat.name}
                            </Link>
                        ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <CartDrawer />
                    <button onClick={() => setOpen(true)} className="group -m-2 flex items-center p-2">
                        <ShoppingCartIcon className="size-6 text-gray-400 group-hover:text-gray-500" />
                        {count > 0 && (
                            <span className="absolute bg-red-500 text-white text-xs rounded-full px-1">
                                {count}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="link">Mon compte</Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Separator />
                                    <div className="grid gap-2">
                                        <Link href="/profile" className="text-sm p-2 rounded hover:bg-gray-100">
                                            Profil
                                        </Link>
                                        <Link href="/orders" className="text-sm p-2 rounded hover:bg-gray-100">
                                            Mes commandes
                                        </Link>
                                        <Button
                                            variant="default"
                                            onClick={handleLogout}
                                            className="text-sm px-2 py-1 w-full text-left hover:opacity-90"
                                        >
                                            Se déconnecter
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Link href="/login" className="text-sm hover:underline">
                            Se connecter
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
