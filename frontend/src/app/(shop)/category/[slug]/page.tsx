import CategoryPageClient from "@/components/features/Category/CategoryClient";
import { getProductsByCategorySlug } from "@/lib/api/product";
import { getCategoryBySlug } from "@/lib/api/category";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Category } from "@/types/Category";

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
            brand: category.name ? { "@type": "Brand", name: category.name } : undefined,
            offers: {
                "@type": "Offer",
                url: `/products/${product.slug}`,
                priceCurrency: "EUR",
                price: product.isOnSale && product.salePrice ? String(product.salePrice) : String(product.price),
                availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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

    return {
        title: `${category.name} artisanaux faits main - Sacs à Bonheur`,
        description: `Découvrez notre collection de ${category.name.toLowerCase()} cousus à la main à Saint-Nazaire. Élégants, durables, uniques. Livraison rapide en France.`,
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
