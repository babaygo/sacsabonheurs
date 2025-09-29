"use client";

import { useCartStore } from "@/lib/cartStore";

export default function AddToCartButton({
    product,
    onAdded,
}: {
    product: any;
    onAdded?: () => void;
}) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleClick = () => {
        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: JSON.parse(product.images)[0],
        });
        if (onAdded) onAdded();
    };

    return (
        <button
            className={`px-4 py-2 rounded ${product.stock > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-600'}`}
            disabled={product.stock <= 0}
            aria-disabled={product.stock <= 0}
            onClick={handleClick}
        >
            {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
        </button>
    );
}