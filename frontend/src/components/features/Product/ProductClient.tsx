"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

export default function ProductClient({ initialProduct, slug }: { initialProduct: Product; slug: string }) {
    const { product: liveProduct } = useProductBySlug(slug);
    const product = !initialProduct?.hidden ? liveProduct ?? initialProduct : initialProduct;

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
        <div className="min-h-screen pt-4 px-4 md:px-8">
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
                    <p className="text-lg font-semibold">{product?.price} €</p>

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
        </div>
    );
}
