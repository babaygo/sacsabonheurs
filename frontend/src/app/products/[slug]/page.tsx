import { notFound } from "next/navigation";
import AddToCartDrawer from "@/components/AddToCartDrawer";

async function getProduct(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);
    if (!product) notFound();

    const images = JSON.parse(product.images);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {images.map((src: string, i: number) => (
                        <img key={i} src={src} alt={`${product.name} ${i + 1}`} className="rounded" />
                    ))}
                </div>
                <div>
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                    <p className="text-lg mb-2">{product.price} €</p>
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    <AddToCartDrawer product={product} />
                </div>
            </div>
        </div>
    );
}
