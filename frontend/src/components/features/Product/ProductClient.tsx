"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types/Product";
import ZoomableImage from "@/components/shared/ZoomableImage";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import AddToCart from "../Cart/AddToCart";
import { useProductBySlug } from "@/hooks/useProductBySlug";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProductsByCategory } from "@/hooks/useProductsByCategory";
import { Spinner } from "@/components/ui/spinner";
import { calculateSalePrice, formatPrice } from "@/lib/utils/priceCalculator";

export default function ProductClient({ initialProduct, slug }: { initialProduct: Product; slug: string }) {
    const { product: liveProduct, loadingProduct, errorProduct } = useProductBySlug(slug);
    const product = !initialProduct?.hidden ? liveProduct ?? initialProduct : initialProduct;
    const { products: similarProductsRaw, loadingProducts, errorProducts } = useProductsByCategory(product.categoryId);

    const similarProducts = similarProductsRaw.filter((p) => p.id !== product.id);

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    if (initialProduct?.hidden) {
        return (
            <div className="min-h-screen pt-4 px-4 md:px-8 flex flex-col items-center space-y-6">
                <p>Ce produit n'est pas disponible !</p>
                <Button asChild>
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        );
    }

    if (errorProduct) {
        return (
            <div className="min-h-screen pt-4 px-4 md:px-8 flex flex-col items-center space-y-6">
                <p className="text-red-500">Erreur lors du chargement du produit.</p>
                <Button asChild>
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        );
    }

    if (loadingProduct && !product) {
        return (
            <div className="min-h-screen pt-4 px-4 md:px-8 flex flex-col items-center space-y-6">
                <Spinner />
            </div>
        );
    }

    const accordionItems = [
        {
            key: "item-1",
            label: "Description",
            content: (
                <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product?.description || "" }}
                />
            ),
        },
        {
            key: "item-2",
            label: "Dimensions",
            content: `${product?.height} x ${product?.lenght} x ${product?.width} cm`,
        },
        {
            key: "item-3",
            label: "Poids",
            content: `${product?.weight} g`,
        },
    ];

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique", href: "/boutique" },
                    { label: product?.name! },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="hidden md:grid md:col-span-3 justify-items-center">
                    {product?.images.map((_, i) => (
                        <ZoomableImage
                            key={i}
                            images={product.images}
                            index={i}
                            alt={`${product.name} ${i + 1}`}
                        />
                    ))}
                </div>

                <div className="md:hidden col-span-1">
                    <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
                        <CarouselContent>
                            {product?.images.map((src, i) => (
                                <CarouselItem key={i}>
                                    <div className="relative w-full aspect-square overflow-hidden">
                                        <Image
                                            src={src}
                                            alt={`${product.name} ${i + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                            fetchPriority={i === 0 ? "high" : "auto"}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="flex justify-end mt-2">
                        <div className="flex gap-2 px-3 py-2 bg-gray-200/60 backdrop-blur-md rounded-full">
                            {product?.images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition ${i === current ? "bg-primary" : "bg-gray-300"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col space-y-4">
                    <p className="text-2xl mt-2 md:mt-4">{product?.name}</p>
                    
                    {(() => {
                        const priceInfo = calculateSalePrice(
                            product?.price || 0,
                            product?.isOnSale || false,
                            product?.salePrice,
                            product?.salePercentage
                        );
                        
                        return (
                            <div className="space-y-1">
                                {priceInfo.isOnSale ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg line-through text-gray-500">
                                            {formatPrice(priceInfo.originalPrice)} €
                                        </span>
                                        <span className="text-2xl font-bold text-red-600">
                                            {formatPrice(priceInfo.displayPrice)} €
                                        </span>
                                        <span className="text-sm font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">
                                            -{product?.salePercentage ? Math.round(product.salePercentage) + '%' : 'Solde'}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-lg font-semibold">{formatPrice(priceInfo.displayPrice)} €</p>
                                )}
                            </div>
                        );
                    })()}

                    <AddToCart product={product} className="w-full" />

                    <Accordion type="multiple" defaultValue={["item-1"]}>
                        <Separator />
                        {accordionItems.map(({ key, label, content }) => (
                            <AccordionItem key={key} value={key}>
                                <AccordionTrigger className="font-semibold">{label}</AccordionTrigger>
                                <AccordionContent>{content}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            {!loadingProducts && !errorProducts && similarProducts.length > 0 && (
                <div className="pt-10">
                    <h2 className="font-bold py-4">Vous aimerez aussi</h2>
                    
                    <Carousel className="w-full" setApi={setApi} opts={{ align: "center", loop: true }}>
                        <CarouselContent className="m-0">
                            {similarProducts.map((p, i) => (
                                <CarouselItem
                                    key={i}
                                    className="basis-1/2 md:basis-1/3 lg:basis-1/5 px-1"
                                >
                                    <Link key={p.id} href={`/products/${p.slug}`}>
                                        <div className="relative w-full aspect-square max-w-[450px] overflow-hidden group">
                                            <Image
                                                src={p.images[0]}
                                                alt={p.name}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                fill
                                                fetchPriority="auto"
                                                className="object-cover w-full h-auto block transition-opacity duration-300"
                                            />
                                            <div className="w-full flex justify-center py-2 px-4 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600">
                                                <AddToCart product={p} className="rounded-full" />
                                            </div>
                                        </div>

                                        <div className="w-full flex justify-between items-center mt-1 space-x-2 px-2">
                                            <p className="flex-1 text-sm font-medium text-[15px] truncate">{p.name}</p>
                                            <div className="w-auto text-sm text-end">
                                                {(() => {
                                                    const priceInfo = calculateSalePrice(p.price, p.isOnSale, p.salePrice, p.salePercentage);
                                                    if (priceInfo.isOnSale) {
                                                        return (
                                                            <div className="flex flex-col items-end gap-0.5">
                                                                <span className="line-through text-gray-400 text-xs">{formatPrice(priceInfo.originalPrice)} €</span>
                                                                <span className="font-bold text-red-600">{formatPrice(priceInfo.displayPrice)} €</span>
                                                            </div>
                                                        );
                                                    }
                                                    return <span>{formatPrice(priceInfo.displayPrice)} €</span>;
                                                })()}
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {(
                            (window.innerWidth < 768 && similarProducts.length > 2) ||
                            (window.innerWidth >= 768 && window.innerWidth < 1024 && similarProducts.length > 3) ||
                            (window.innerWidth >= 1024 && similarProducts.length > 5)
                        ) && (
                                <>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </>
                            )}
                    </Carousel>
                </div>
            )}
        </div>
    );
}
