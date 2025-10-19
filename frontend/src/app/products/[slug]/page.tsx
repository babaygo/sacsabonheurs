"use client";

import { notFound } from "next/navigation";
import AddToCartDrawer from "@/components/AddToCartDrawer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Product } from "@/types/Product";
import { getBaseUrl } from "@/lib/getBaseUrl";
import ZoomableImage from "@/components/ZoomableImage";
import { use, useEffect, useState } from "react";
import BreadCrumb from "@/components/BreadCrumb";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch(`${getBaseUrl()}/api/products/${slug}`, { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data) {
                    notFound();
                } else {
                    setProduct(data);
                }
            });
    }, []);

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique", href: "/boutique" },
                    { label: product?.name! },
                ]}
            />
            <div className="grid grid-cols-2 gap-8">
                <div className="grid justify-items-center grid-cols-1 gap-4">
                    {product?.images.map((src, i) => (
                        <ZoomableImage
                            key={i}
                            images={product.images}
                            index={i}
                            alt={`${product.name} ${i + 1}`}
                        />
                    ))}

                </div>
                <div className="flex flex-col mr-38">
                    <p className="text-2xl mt-4">{product?.name}</p>
                    <p className="text-lg font-semibold my-4">{product?.price} €</p>

                    <AddToCartDrawer product={product} />

                    <div className="flex flex-col">
                        <Accordion type="multiple" defaultValue={["item-1"]}>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="font-semibold">Description</AccordionTrigger>
                                <AccordionContent>
                                    {product?.description}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="font-semibold">Dimensions</AccordionTrigger>
                                <AccordionContent>
                                    {product?.height}*{product?.lenght}*{product?.width} cm
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="font-semibold">Poids</AccordionTrigger>
                                <AccordionContent>
                                    {product?.weight} g
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
