import ProductClient from "@/components/features/Product/ProductClient";
import { getProductBySlug } from "@/lib/api/product";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    return {
        title: product ? `${product.name} - Sacs à Bonheurs` : "Produit introuvable - Sacs à Bonheurs"
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) return notFound();

    return <ProductClient product={product} />;
}
