"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Product } from "@/types/Product";
import ZoomableImage from "@/components/ZoomableImage";
import BreadCrumb from "@/components/BreadCrumb";
import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import AddToCart from "../AddToCart";

export default function ProductClient({ product: initialProduct }: { product: Product }) {
    const [product, setProduct] = useState<Product>(initialProduct);

    useEffect(() => {
        const refetch = async () => {
            const res = await fetch(`${getBaseUrl()}/api/products/${initialProduct.slug}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const fresh = await res.json();
                setProduct(fresh);
            }
        };

        refetch();
    }, [initialProduct.slug]);

    return (
        <div className="min-h-screen pt-4 px-4 md:px-8">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique", href: "/boutique" },
                    { label: product?.name! },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="hidden md:grid justify-items-center grid-cols-1 gap-4">
                    {product?.images.map((src, i) => (
                        <ZoomableImage
                            key={i}
                            images={product.images}
                            index={i}
                            alt={`${product.name} ${i + 1}`}
                        />
                    ))}
                </div>
                <div className="md:hidden my-4">
                    <Carousel>
                        <CarouselContent>
                            {product?.images.map((src, i) => (
                                <CarouselItem key={i}>
                                    <div
                                        className="w-full h-[400px] bg-center bg-cover bg-no-repeat rounded-xl"
                                        style={{ backgroundImage: `url(${src})` }}
                                        role="img"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="flex flex-col space-y-4">
                    <p className="text-2xl mt-2 md:mt-4 text-center md:text-left">{product?.name}</p>
                    <p className="text-lg font-semibold text-center md:text-left">{product?.price} €</p>

                    <div className="flex justify-center md:justify-start">
                        <AddToCart product={initialProduct} className="w-full max-w-xs" />
                    </div>

                    <Accordion type="multiple" defaultValue={["item-1"]}>
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="font-semibold">Description</AccordionTrigger>
                            <AccordionContent>{product?.description}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="font-semibold">Dimensions</AccordionTrigger>
                            <AccordionContent>
                                {product?.height} x {product?.lenght} x {product?.width} cm
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="font-semibold">Poids</AccordionTrigger>
                            <AccordionContent>{product?.weight} g</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
