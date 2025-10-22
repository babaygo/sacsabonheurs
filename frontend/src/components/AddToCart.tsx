import { useCart } from "@/lib/useCart";
import { Button } from "./ui/button";
import { Product } from "@/types/Product";

type AddToCartProps = {
    product: Product;
    className?: string;
    variant?: "default" | "secondary" | "outline" | "ghost";
};

export default function AddToCart({ product, className, variant }: AddToCartProps) {
    const { addToCart, setOpen } = useCart();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
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
            disabled={product?.stock <= 0}
            variant={variant ?? (product?.stock > 0 ? "default" : "secondary")}
            className="w-full hover:opacity-100 rounded-none"
        >
             {product?.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
        </Button>
    )
}