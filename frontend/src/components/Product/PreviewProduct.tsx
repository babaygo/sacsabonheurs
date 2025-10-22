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
            <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
                <div
                    className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                    style={{ backgroundImage: `url(${product.images?.[0]})` }}
                    role="img"
                />

                {product.images?.[1] && (
                    <div
                        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundImage: `url(${product.images[1]})` }}
                        role="img"
                    />
                )}

                <div
                    className="w-full flex justify-center py-2 px-4 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600"
                >
                    <AddToCart product={product} className="rounded-full" />
                </div>
            </div>

            <h3 className="mt-4 text-center">{product.name}</h3>
            <p className="text-sm font-semibold">{product.price.toFixed(2)} €</p>
        </Link>
    );
}