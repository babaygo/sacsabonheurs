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

    const isUnavailable = product?.unavailable === true;
    const isOutOfStock = product?.stock <= 0;
    const isBuyable = !isUnavailable && !isOutOfStock;

    const label = isUnavailable
        ? "Indisponible"
        : isOutOfStock
            ? "Rupture de stock"
            : "Ajouter au panier";

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isBuyable) return;

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
            disabled={!isBuyable}
            variant={variant ?? (isBuyable ? "default" : "secondary")}
            className={`hover:opacity-100" ${className}`}
        >
             {label}
        </Button>
    )
}