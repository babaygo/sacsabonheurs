import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/Product";
import { calculateSalePrice } from "@/lib/utils/priceCalculator";

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
        
        const priceInfo = calculateSalePrice(
            product.price,
            product.isOnSale || false,
            product.salePrice,
            product.salePercentage
        );
        
        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: priceInfo.displayPrice,
            image: product.images[0],
            originalPrice: priceInfo.originalPrice,
            isOnSale: priceInfo.isOnSale,
        });
        setOpen(true);
    };

    return (
        <Button
            onClick={handleClick}
            disabled={product?.stock <= 0}
            variant={variant ?? (product?.stock > 0 ? "default" : "secondary")}
            className={`hover:opacity-100" ${className}`}
        >
             {product?.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
        </Button>
    )
}