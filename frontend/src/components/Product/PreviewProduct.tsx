import { Product } from "@/types/Product";
import Link from "next/link";
import AddToCart from "../AddToCart";

export default function PreviewProduct({ product }: { product: Product }) {
    return (
        <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex flex-col items-center py-4 group"
        >
            <div className="relative w-full h-[400px] overflow-hidden">
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

                <div className="w-full py-2 px-4 absolute bottom-0 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
                    <AddToCart product={product} />
                </div>
            </div>

            <h3 className="mt-4 text-center">{product.name}</h3>
            <p className="text-sm font-semibold">{product.price.toFixed(2)} €</p>
        </Link>

    );
}