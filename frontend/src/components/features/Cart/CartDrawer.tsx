"use client";

import { useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter, DrawerDescription } from "@/components/ui/drawer";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useCartDrawerStore } from "@/lib/stores/cartDrawerStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import toast from "react-hot-toast";
import Image from "next/image";
import { useProductsContext } from "@/contexts/ProductsContext";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
    const { user } = useSessionContext();
    const { fetchProducts } = useProductsContext();
    const { open, setOpen } = useCartDrawerStore();
    const items = useCartStore((s) => s.items);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const clearCart = useCartStore((s) => s.clearCart);
    const router = useRouter();

    const total = useMemo(() => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [items]);

    async function handleCheckout() {
        try {
            if (!user) {
                router.push("/signup");
                toast.success("Un compte est requis pour commander.", { icon: <Info /> });
                return;
            }

            const res = await fetch(`${getBaseUrl()}/api/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.error);
                return null;
            }

            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            toast.error(`Une erreur est survenue. ${error}`);
        } finally {
            clearCart();
            setOpen(false);
            fetchProducts();
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-w-md ml-auto h-full flex flex-col">
                <DrawerDescription />
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
                        <div className="flex flex-col justify-center items-center h-1/2">
                            <p className="text-mute-foreground">Votre panier est vide</p>
                            <Button variant="link" asChild onClick={() => setOpen(false)}>
                                <Link href="/boutique" className="!text-base font-semibold">
                                    La Boutique →
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        items.map((item, i) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 object-cover rounded"
                                    fetchPriority={i === 0 ? "high" : "auto"}
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.price} €
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
    );
}
