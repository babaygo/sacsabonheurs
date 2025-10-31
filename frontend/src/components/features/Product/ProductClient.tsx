"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Product } from "@/types/Product";
import ZoomableImage from "@/components/shared/ZoomableImage";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import AddToCart from "../Cart/AddToCart";

export default function ProductClient({ product }: { product: Product }) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) return

        setCurrent(api.selectedScrollSnap())
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        });
    }, [api]);

    return (
        <div className="min-h-screen pt-4 px-4 md:px-8">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique", href: "/boutique" },
                    { label: product?.name! },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 mt-6">
                <div className="hidden md:grid md:col-span-3 justify-items-center grid-cols-1 gap-4">
                    {product?.images.map((src, i) => (
                        <ZoomableImage
                            key={i}
                            images={product.images}
                            index={i}
                            alt={`${product.name} ${i + 1}`}
                        />
                    ))}
                </div>
                <div className="md:hidden col-span-1 my-4">
                    <Carousel
                        className="w-full"
                        setApi={setApi}
                    >
                        <CarouselContent>
                            {product?.images.map((src, indexImages) => (
                                <CarouselItem key={indexImages}>
                                    <div className="relative w-full aspect-square overflow-hidden">
                                        <Image
                                            src={src}
                                            alt={`${product.name} ${indexImages + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                            fetchPriority={indexImages === 0 ? "high" : "auto"}
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
                    <p className="text-2xl mt-2 md:mt-4 text-left">{product?.name}</p>
                    <p className="text-lg font-semibold text-left">{product?.price} €</p>

                    <div className="flex">
                        <AddToCart product={product} className="w-full" />
                    </div>

                    <Accordion type="multiple" defaultValue={["item-1"]}>
                        <Separator />
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="font-semibold">Description</AccordionTrigger>
                            <AccordionContent>
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product?.description || "" }}
                                />
                            </AccordionContent>
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
