import { Product } from "@/types/Product";
import Link from "next/link";

export default function PreviewProduct({ product }: { product: Product }) {
    return (
        <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex flex-col items-center py-4 group"
        >
            <div className="relative w-full h-100 rounded overflow-hidden">
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                {product.images?.[1] && (
                    <img
                        src={product.images[1]}
                        alt={`${product.name} - vue secondaire`}
                        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                )}
            </div>

            <h3 className="mt-4">{product.name}</h3>
            <p className="text-sm font-semibold mt-2">{product.price.toFixed(2)} €</p>
        </Link>
    );
}