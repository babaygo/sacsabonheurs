import CollectionClient from "@/components/features/Collection/CollectionClient";
import { getCollectionBySlug } from "@/lib/api/collection";
import { getProducts } from "@/lib/api/product";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const collection = await getCollectionBySlug("jacquard");
    if (!collection) return {};
    return {
        title: collection.metaTitle,
        description: collection.metaDescription,
        openGraph: {
            title: collection.metaTitle,
            description: collection.metaDescription,
            images: collection.heroImage ? [{ url: collection.heroImage, width: 1200, height: 630, alt: collection.title }] : [],
        },
    };
}

export default async function JacquardCollectionPage() {
    const [collection, products] = await Promise.all([
        getCollectionBySlug("jacquard"),
        getProducts(100, true),
    ]);

    if (!collection) notFound();

    return <CollectionClient collection={collection} products={products} />;
}
