import ProductClient from "@/components/Product/ProductClient";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Product } from "@/types/Product";
import { notFound } from "next/navigation";

const productCache = new Map<string, Product | null>();

async function getProduct(slug: string): Promise<Product | null> {
    if (productCache.has(slug)) return productCache.get(slug)!;

    try {
        const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`Erreur API produit ${slug} : ${res.status}`);
            productCache.set(slug, null);
            return null;
        }

        const data = await res.json();
        productCache.set(slug, data);
        return data;
    } catch (err: any) {
        console.error(`Erreur réseau produit ${slug} :`, err.message);
        productCache.set(slug, null);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    return {
        title: product ? `${product.name} - Sacs à Bonheurs` : "Produit introuvable - Sacs à Bonheurs",
        description: product?.description?.slice(0, 160) || "Découvrez nos sacs faits main en France.",
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) return notFound();

    return <ProductClient product={product} />;
}

