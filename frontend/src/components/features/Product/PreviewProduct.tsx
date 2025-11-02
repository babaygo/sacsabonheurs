import { Product } from "@/types/Product";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "../Cart/AddToCart";

export default function PreviewProduct({ product }: { product: Product }) {
    return (
        <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex flex-col items-center py-4 group"
        >
            <div className="relative w-full aspect-square max-w-[450px] overflow-hidden">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover w-full h-auto block transition-opacity duration-300 group-hover:opacity-0"
                />

                {product.images[1] && (
                    <Image
                        src={product.images[1]}
                        alt={`${product.name} alt`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover w-full h-auto block transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                )}

                <div className="w-full flex justify-center py-2 px-4 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600">
                    <AddToCart product={product} className="rounded-full" />
                </div>
            </div>

            <h3 className="mt-4 text-center">{product.name}</h3>
            <p className="text-sm font-semibold">{product.price.toFixed(2)} €</p>
        </Link>
    );
}
