"use client";

import Link from "next/link";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/authClient";
import { useRouter } from "next/navigation";
import CartDrawer from "@/components/features/Cart/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { Menu, ShoppingBasket, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../../../ui/sheet";
import Image from "next/image";

export default function HeaderClient() {
    const { user, loadingUser, refreshSession } = useSessionContext();
    const router = useRouter();
    const { setOpen, count } = useCart();
    let isAdmin: boolean = false;

    if (user?.role == "admin") {
        isAdmin = true;
    }

    const handleLogout = async () => {
        await authClient.signOut();
        await refreshSession();
        router.push("/");
    };

    return (
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 left-0 w-full z-50 bg-primary-foreground py-4">
            <nav className="hidden md:flex absolute top-6 left-2 flex space-x-6 text-l font-medium">
                <Link href="/contact">Contact</Link>
                <Link href="/a-propos">À propos</Link>
                <Link href="/boutique">Boutique</Link>
            </nav>

            <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-3">
                    <Link href={"/"}>
                        <Image
                            src="/sacs-a-bonheurs-logo.png"
                            alt="Logo Sacs à Bonheurs"
                            loading="lazy"
                            width={48}
                            height={48}
                            className="h-12 w-auto"
                        />
                    </Link>
                    <Link href="/" className="hidden md:flex text-4xl font-playfair-display font-semibold">
                        Sacs à Bonheurs
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground">Fabriqué à la main, en France</p>
            </div>

            <div className="hidden md:flex absolute top-6 right-2 flex items-center space-x-2">
                <CartDrawer />
                {!loadingUser && user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="hover:bg-white">
                                <UserRound className="size-6 text-primary" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <Separator />
                                <div className="grid gap-2">
                                    <Link href="/orders" className="text-sm p-2 rounded">Mes commandes</Link>
                                    <Button
                                        variant="default"
                                        onClick={handleLogout}
                                        className="text-sm px-2 py-1 w-full text-left hover:opacity-90"
                                    >
                                        Se déconnecter
                                    </Button>
                                    {isAdmin && (
                                        <>
                                            <Separator />
                                            <Link href="/admin" className="text-sm p-2 rounded">Admin</Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Link href="/login" className="text-sm hover:underline">
                        Se connecter
                    </Link>
                )}
                <Button
                    variant="ghost"
                    onClick={() => setOpen(true)}
                    className="group -m-2 flex items-center p-2 relative hover:bg-white"
                >
                    <ShoppingBasket className="size-6 text-primary" />
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                            {count}
                        </span>
                    )}
                </Button>
            </div>

            <div className="md:hidden absolute top-6 left-2">
                <Sheet>
                    <SheetTitle />
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="p-2">
                            <Menu className="size-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <SheetDescription />
                        <div className="mt-6 space-y-6">
                            {!loadingUser && user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <UserRound className="size-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex flex-col space-y-2">
                                        <Link href="/orders" className="text-sm hover:underline">Mes commandes</Link>
                                        <Link href="/boutique" className="text-sm hover:underline">Boutique</Link>
                                        {isAdmin && <Link href="/admin" className="text-sm hover:underline">Admin</Link>}
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="text-sm justify-start px-0 hover:underline"
                                        >
                                            Se déconnecter
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" className="text-sm hover:underline">
                                    Se connecter
                                </Link>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="md:hidden absolute top-8 right-2">
                <Button
                    variant="ghost"
                    onClick={() => setOpen(true)}
                    className="group -m-2 flex items-center p-2 relative hover:bg-white"
                >
                    <ShoppingBasket className="size-6 text-primary" />
                    {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                            {count}
                        </span>
                    )}
                </Button>
            </div>
        </header>
    );
}
