"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import AddToCartButton from "@/components/AddToCartButton";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddToCartDrawer({ product }: { product: any }) {
    const [open, setOpen] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const handleAdd = () => {
        // kept for backward compatibility if needed elsewhere
        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: JSON.parse(product.images)[0],
        });
        setOpen(true);
    };

    return (
        <>
            <AddToCartButton product={product} onAdded={() => setOpen(true)} />

            {/* Drawer */}
            <div className={`fixed inset-0 z-50 transition-all ${open ? "visible" : "invisible"}`}>
                <div
                    className={`absolute inset-0 bg-opacity-50 transition-opacity ${open ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={() => setOpen(false)}
                />
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex items-center justify-between px-4 py-4 border-b">
                        <h2 className="text-lg font-semibold">Ton panier</h2>
                        <button onClick={() => setOpen(false)}>
                            <XMarkIcon className="size-6 text-gray-500 hover:text-black" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
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
                </div>
            </div>
        </>
    );
}
