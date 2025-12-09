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
import { LogOut, Menu, ShoppingBasket, UserRound } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeaderClient() {
    const { user, loadingUser, refreshSession } = useSessionContext();
    const router = useRouter();
    const { setOpen, count } = useCart();
    const [openSheet, setOpenSheet] = useState(false);
    const [openSheetMobile, setOpenSheetMobile] = useState(false);
    let isAdmin: boolean = false;

    if (user?.role === "admin") {
        isAdmin = true;
    }

    const handleLogout = async () => {
        await authClient.signOut();
        await refreshSession();
        router.push("/");
    };

    return (
        <header className="w-full sticky top-0 left-0 z-50 transition-all duration-300 border-b border-transparent bg-primary-foreground shadow-sm border-border/10 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">

                    <div className="flex-1 flex justify-start items-center">
                        <div className="md:hidden">
                            <Sheet open={openSheetMobile} onOpenChange={setOpenSheetMobile}>
                                <SheetTitle className="hidden">Menu Mobile</SheetTitle>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" className="p-2 -ml-2">
                                        <Menu className="size-6 text-primary" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-0">
                                    <SheetDescription className="hidden">Navigation Mobile</SheetDescription>
                                    <div className="mt-6 space-y-6">
                                        {!loadingUser && user ? (
                                            <>
                                                <div className="space-y-2 px-3 m-0">
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => {
                                                            setOpenSheetMobile(false);
                                                            handleLogout();
                                                        }}
                                                        className="text-xs p-0! m-0 hover:underline flex items-center gap-2"
                                                    >
                                                        Se déconnecter
                                                        <LogOut className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <Separator />
                                                <div className="flex flex-col space-y-4 px-3">
                                                    <Link href="/" onClick={() => setOpenSheetMobile(false)} className="text-sm hover:underline">Accueil</Link>
                                                    <Link href="/orders" onClick={() => setOpenSheetMobile(false)} className="text-sm hover:underline">Mes commandes</Link>
                                                    <Link href="/boutique" onClick={() => setOpenSheetMobile(false)} className="text-sm hover:underline">Boutique</Link>
                                                    {isAdmin && (
                                                        <Link href="/admin" onClick={() => setOpenSheetMobile(false)} className="text-sm hover:underline">Admin</Link>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col space-y-4 px-3">
                                                <Link href="/login" onClick={() => setOpenSheetMobile(false)} className="text-sm hover:underline">Se connecter</Link>
                                                <Separator />
                                                <Link href="/boutique" onClick={() => setOpenSheetMobile(false)} className="text-sm hover:underline">Boutique</Link>
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="hidden md:block">
                            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                                <SheetTitle className="hidden">Menu Principal</SheetTitle>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" className="p-0 hover:bg-white -ml-2">
                                        <Menu className="size-6 text-primary" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0">
                                    <SheetDescription className="hidden">Navigation Principale</SheetDescription>
                                    <div className="flex flex-col mt-12 space-y-5">
                                        <Separator />
                                        <Link href="/" onClick={() => setOpenSheet(false)} className="text-l px-6">Accueil</Link>
                                        <Separator />
                                        <Link href="/boutique" onClick={() => setOpenSheet(false)} className="text-l px-6">Boutique</Link>
                                        <Separator />
                                        <Link href="/a-propos" onClick={() => setOpenSheet(false)} className="text-l px-6">À propos</Link>
                                        <Separator />
                                        <Link href="/contact" onClick={() => setOpenSheet(false)} className="text-l px-6">Contact</Link>
                                        <Separator />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-1 shrink-0">
                        <div className="flex items-center space-x-3">
                            <Link href="/">
                                <Image
                                    src="/assets/sacs-a-bonheurs-logo.png"
                                    alt="Logo Sacs à Bonheurs"
                                    loading="lazy"
                                    width={48}
                                    height={48}
                                    className="h-12 w-auto object-contain"
                                />
                            </Link>
                            <Link href="/" className="hidden md:flex text-3xl lg:text-4xl font-playfair-display font-bold whitespace-nowrap">
                                Sacs à Bonheurs
                            </Link>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-center whitespace-nowrap">
                            Fabriqué à la main, en France
                        </p>
                    </div>

                    <div className="flex-1 flex justify-end items-center space-x-2">
                        <CartDrawer />
                        <div className="hidden md:block">
                            {!loadingUser && user ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="hover:bg-white p-2">
                                            <UserRound className="size-6 text-primary" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="center">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-sm text-muted-foreground break-all">{user.email}</p>
                                            </div>
                                            <Separator />
                                            <div className="grid gap-2">
                                                <Link href="/orders" className="text-sm p-2 rounded">Mes commandes</Link>
                                                <Button
                                                    onClick={handleLogout}
                                                    className="flex items-center"
                                                >
                                                    Se déconnecter
                                                    <LogOut />
                                                </Button>
                                                {isAdmin && (
                                                    <>
                                                        <Separator />
                                                        <Link href="/admin" className="text-sm p-2">Admin</Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Link href="/signup">
                                    <Button variant="ghost" className="hover:bg-white p-2">
                                        <UserRound className="size-6 text-primary" />
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => setOpen(true)}
                            className="group flex items-center p-2 relative hover:bg-white -mr-2"
                        >
                            <ShoppingBasket className="size-6 text-primary" />
                            {count > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}