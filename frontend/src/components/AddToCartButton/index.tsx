import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart, setOpen } = useCart();

    const handleClick = () => {
        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0],
        });
        setOpen(true);
    };

    return (
        <Button
            onClick={handleClick}
            disabled={product.stock <= 0}
            variant={product.stock > 0 ? "default" : "secondary"}
            className={product.stock > 0 ? "my-4 cursor-pointer hover:opacity-75" : "my-4 text-gray-600"}
        >
            {product.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
        </Button>

    );
}
