import CollectionClient from "@/components/features/Collection/CollectionClient";
import { getCollectionBySlug, getCollections } from "@/lib/api/collection";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const collections = await getCollections();
    return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);
    if (!collection) return {};
    return {
        title: collection.metaTitle,
        description: collection.metaDescription,
        alternates: { canonical: `/collections/${slug}` },
        openGraph: {
            type: "website",
            url: `/collections/${slug}`,
            title: collection.metaTitle,
            description: collection.metaDescription,
            images: collection.heroImage
                ? [{ url: collection.heroImage, width: 1200, height: 630, alt: collection.title }]
                : [],
            siteName: "Sacs à Bonheurs",
            locale: "fr_FR",
        },
    };
}

export default async function CollectionPage({ params }: Props) {
    const { slug } = await params;
    const collection = await getCollectionBySlug(slug);

    if (!collection) notFound();

    return <CollectionClient collection={collection} />;
}
