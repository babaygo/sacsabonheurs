import { notFound } from "next/navigation";
import AddToCartDrawer from "@/components/AddToCartDrawer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

async function getProduct(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
        credentials: "include"
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);
    if (!product) notFound();

    const images = JSON.parse(product.images);

    return (
        <div className="max-w-7xl mx-auto p-4 mt-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="grid grid-cols-2 gap-4">
                    {images.map((src: string, i: number) => (
                        <img key={i} src={src} alt={`${product.name} ${i + 1}`} className="" />
                    ))}
                </div>
                <div className="flex flex-col mr-38">
                    <p className="text-2xl mt-4">{product.name}</p>
                    <p className="text-lg my-4">{product.price} €</p>

                    <AddToCartDrawer product={product} />

                    <div className="flex flex-col">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Description</AccordionTrigger>
                                <AccordionContent>
                                    {product.description}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
