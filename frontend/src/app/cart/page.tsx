"use client";

import { useCartStore } from "@/lib/cartStore";
import Link from "next/link";

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Panier</h1>
            {items.length === 0 ? (
                <p>Ton panier est vide.</p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                                <Link href={`/products/${item.slug}`} className="font-semibold hover:underline">
                                    {item.name}
                                </Link>
                                <p>{item.price} € × {item.quantity}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:underline"
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
