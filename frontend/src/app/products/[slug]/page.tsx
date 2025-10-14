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

async function getProduct(slug: string) {
    const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
        credentials: "include"
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product: Product = await getProduct(params.slug);
    if (!product) notFound();

    return (
        <div className="max-w-7xl mx-auto min-h-screen p-4 mt-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="grid justify-items-center grid-cols-1 gap-4">
                    {product.images.map((src, i) => (
                        <ZoomableImage
                            key={i}
                            images={product.images}
                            index={i}
                            alt={`${product.name} ${i + 1}`}
                        />
                    ))}

                </div>
                <div className="flex flex-col mr-38">
                    <p className="text-2xl mt-4">{product.name}</p>
                    <p className="text-lg my-4">{product.price} €</p>

                    <AddToCartDrawer product={product} />

                    <div className="flex flex-col">
                        <Accordion type="multiple">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Description</AccordionTrigger>
                                <AccordionContent>
                                    {product.description}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Dimensions</AccordionTrigger>
                                <AccordionContent>
                                    {product.height}*{product.lenght}*{product.width}*
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Poids</AccordionTrigger>
                                <AccordionContent>
                                    {product.weight}g
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
