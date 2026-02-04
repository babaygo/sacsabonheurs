import { Product } from "@/types/Product";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "../Cart/AddToCart";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { calculateSalePrice, formatPrice } from "@/lib/utils/priceCalculator";

export default function PreviewProduct({ product }: { product: Product }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });

        return () => {
            api.off("select", () => {
                setCurrent(api.selectedScrollSnap());
            });
        };
    }, [api]);

    return (
        <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="flex flex-col items-start py-4 group"
        >
            <div className="hidden md:block relative w-full aspect-square max-w-[450px] overflow-hidden">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    fetchPriority="auto"
                    className="object-cover w-full h-auto block transition-opacity duration-300 group-hover:opacity-0"
                />

                {product.images[1] && (
                    <Image
                        src={product.images[1]}
                        alt={`${product.name} alt`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                        className="object-cover w-full h-auto block transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                )}

                <div className="w-full flex justify-center py-2 px-4 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600">
                    <AddToCart product={product} className="rounded-full" />
                </div>
            </div>

            <div className="md:hidden relative w-full max-w-[450px]">
                <div className="relative w-full aspect-square">
                    <Carousel opts={{ loop: true }} setApi={setApi}>
                        <CarouselContent>
                            {product.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full aspect-square">
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            fill
                                            priority={index === 0}
                                            className="object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                {product.images.length > 1 && (
                    <div className="flex">
                        {product.images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    api?.scrollTo(index);
                                }}
                                className={`h-0.5 w-full transition-all ${index === current
                                        ? 'bg-primary'
                                        : 'bg-transparent'
                                    }`}
                                aria-label={`Voir l'image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 text-start">
                <h3 className="font-semibold text-[15px]">{product.name}</h3>
                {(() => {
                    const priceInfo = calculateSalePrice(product.price, product.isOnSale, product.salePrice, product.salePercentage);
                    if (priceInfo.isOnSale) {
                        return (
                            <div className="space-y-1">
                                <p className="font-medium text-sm line-through text-gray-500">
                                    {formatPrice(priceInfo.originalPrice)} €
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm text-red-600">
                                        {formatPrice(priceInfo.displayPrice)} €
                                    </p>
                                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                        -{product.salePercentage ? Math.round(product.salePercentage) + '%' : ''}
                                    </span>
                                </div>
                            </div>
                        );
                    }
                    return <p className="font-medium text-sm">{formatPrice(priceInfo.displayPrice)} €</p>;
                })()}
            </div>
        </Link>
    );
}