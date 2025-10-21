"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Product } from "@/types/Product";
import ZoomableImage from "@/components/ZoomableImage";
import BreadCrumb from "@/components/BreadCrumb";
import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useCart } from "@/lib/useCart";
import { Button } from "../ui/button";

export default function ProductClient({ product: initialProduct }: { product: Product }) {
    const [product, setProduct] = useState<Product>(initialProduct);
    const { addToCart, setOpen } = useCart();

    const handleClick = () => {
        addToCart({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images[0],
        });
        setOpen(true);
    };

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

                    <Button
                        onClick={handleClick}
                        disabled={product?.stock <= 0}
                        variant={product?.stock > 0 ? "default" : "secondary"}
                        className={product?.stock > 0 ? "my-4 hover:opacity-75" : "my-4 text-gray-600"}
                    >
                        {product?.stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
                    </Button>

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
