import { useCart } from "@/lib/useCart";

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart, setOpen } = useCart();

    const handleClick = () => {
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
        <button
            className={`px-4 py-2 rounded ${product.stock > 0 ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-600"
                }`}
            disabled={product.stock <= 0}
            aria-disabled={product.stock <= 0}
            onClick={handleClick}
        >
            {product.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
        </button>
    );
}
