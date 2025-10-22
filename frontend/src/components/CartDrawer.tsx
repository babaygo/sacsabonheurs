"use client";

import { useMemo } from "react";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import { useCartDrawerStore } from "@/lib/cartDrawerStore";
import { useCartStore } from "@/lib/cartStore";
import { getBaseUrl } from "@/lib/getBaseUrl";
import toast from "react-hot-toast";

export default function CartDrawer() {
    const { open, setOpen } = useCartDrawerStore();
    const items = useCartStore((s) => s.items);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const clearCart = useCartStore((s) => s.clearCart);

    const total = useMemo(() => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [items]);

    async function handleCheckout() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: items }),
                credentials: "include",
            });

            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Erreur lors du passage à la caisse :", error);
            toast.error(`Une erreur est survenue. ${error}`);
        } finally {
            clearCart();
            setOpen(false);
        }
    }

    return (
        <>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="max-w-md ml-auto h-full flex flex-col">
                    <DrawerHeader className="flex items-center justify-between px-4 py-4 border-b">
                        <DrawerTitle>Ton panier</DrawerTitle>
                        <DrawerClose asChild>
                            <button>
                                <XMarkIcon className="size-6 text-gray-500 hover:text-black" />
                            </button>
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="p-4 space-y-4 overflow-y-auto flex-1">
                        {items.length === 0 ? (
                            <p className="text-sm text-gray-500">Ton panier est vide.</p>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.price} € × {item.quantity}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {items.length > 0 && (
                        <DrawerFooter className="border-t p-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-600">Total :</span>
                                <span className="text-lg font-semibold">{total.toFixed(2)} €</span>
                            </div>
                            <Button className="w-full" onClick={handleCheckout}>
                                Commander
                            </Button>
                        </DrawerFooter>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
