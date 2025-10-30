import ProductClient from "@/components/features/Product/ProductClient";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Product } from "@/types/Product";
import { notFound } from "next/navigation";

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`Erreur API produit ${slug} : ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (err: any) {
        console.error(`Erreur réseau produit ${slug} :`, err.message);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    return {
        title: product ? `${product.name} - Sacs à Bonheurs` : "Produit introuvable - Sacs à Bonheurs"
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) return notFound();

    return <ProductClient product={product} />;
}
