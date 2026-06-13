import CategoryPageClient from "@/components/features/Category/CategoryClient";
import { getProductsByCategorySlug } from "@/lib/api/product";
import { getCategoryBySlug } from "@/lib/api/category";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Category } from "@/types/Category";
import { SITE_URL, BRAND_NAME } from "@/lib/seo/seo";

type Props = {
    params: Promise<{ slug: string }>;
};

function buildCategorySchema(category: Category) {
    return {
        "@context": "https://schema.org/",
        "@type": "CollectionPage",
        name: `${category.name} - Sacs à Bonheur`,
        description: `Découvrez notre collection de ${category.name.toLowerCase()} artisanaux, fabriqués à la main en France.`,
        hasPart: category.products?.map((product) => ({
            "@type": "Product",
            name: product.name,
            description: product.metaDescription,
            image: Array.isArray(product.images) ? product.images : [],
            sku: product.id ? String(product.id) : undefined,
            category: category.name,
            brand: { "@type": "Brand", name: BRAND_NAME },
            offers: {
                "@type": "Offer",
                url: `${SITE_URL}/products/${product.slug}`,
                priceCurrency: "EUR",
                price: product.isOnSale && product.salePrice ? String(product.salePrice) : String(product.price),
                availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                seller: { "@type": "Organization", name: BRAND_NAME },
            },
        })),
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return { title: "Catégorie - Sacs à Bonheur" };
    }

    const description = `Découvrez notre collection de ${category.name.toLowerCase()} cousus à la main à Saint-Nazaire. Élégants, durables, uniques. Livraison rapide en France.`;
    const ogImage = category.products?.find((p) => Array.isArray(p.images) && p.images[0])?.images[0];

    return {
        title: `${category.name} artisanaux faits main - Sacs à Bonheur`,
        description,
        alternates: { canonical: `/category/${slug}` },
        openGraph: {
            type: "website",
            url: `/category/${slug}`,
            title: `${category.name} artisanaux faits main - Sacs à Bonheur`,
            description,
            images: ogImage ? [{ url: ogImage, alt: category.name }] : undefined,
            siteName: BRAND_NAME,
            locale: "fr_FR",
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const [category, initialProducts] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategorySlug(slug, 24),
    ]);

    if (!category) {
        notFound();
    }

    const schemaObj = buildCategorySchema(category);

    return (
        <>
            {schemaObj && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }} />
            )}
            <CategoryPageClient category={category} initialProducts={initialProducts} categorySlug={slug} />
        </>
    );
}
