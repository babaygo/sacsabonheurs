import ProductClient from "@/components/features/Product/ProductClient";
import { getProductBySlug, getProducts } from "@/lib/api/product";
import { Product } from "@/types/Product";
import { SITE_URL, BRAND_NAME } from "@/lib/seo/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
    const products = await getProducts(undefined, true);
    return products.map((p) => ({ slug: p.slug }));
}

function sanitizeDescription(html?: string) {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildBreadcrumbSchema(product: Product) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Boutique", item: `${SITE_URL}/boutique` },
            { "@type": "ListItem", position: 3, name: product?.name || "", item: `${SITE_URL}/products/${product?.slug}` },
        ],
    };
}

function buildProductSchema(product: Product) {
    const price = product?.isOnSale && product?.salePrice ? product.salePrice : product.price;
    const images = Array.isArray(product?.images) ? product.images : [];

    const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

    const schema: Record<string, any> = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product?.name || "",
        description: sanitizeDescription(product?.description),
        image: images,
        sku: product?.id ? String(product.id) : undefined,
        category: product?.category?.name || undefined,
        color: product?.color || undefined,
        material: product?.material || undefined,
        brand: { "@type": "Brand", name: BRAND_NAME },
        offers: {
            "@type": "Offer",
            url: `${SITE_URL}/products/${product?.slug}`,
            priceCurrency: "EUR",
            price: price !== undefined ? String(price) : undefined,
            priceValidUntil,
            availability: product?.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: BRAND_NAME },
            hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "FR",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 14,
                returnMethod: "https://schema.org/ReturnByMail",
                returnFees: "https://schema.org/ReturnShippingFees",
            },
        },
    };

    const prune = (obj: unknown): unknown => {
        if (Array.isArray(obj)) return obj.map(prune);
        if (obj && typeof obj === "object") {
            const res: any = {};
            Object.entries(obj).forEach(([k, v]) => {
                const pv = prune(v);
                if (pv !== undefined && pv !== null && !(typeof pv === "string" && pv === "")) res[k] = pv;
            });
            return Object.keys(res).length ? res : undefined;
        }
        return obj;
    };

    return prune(schema);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    const fallbackDescription = product
        ? `Découvrez ${product.name}, pièce unique artisanale fabriquée à la main. ${product.category?.name ? `Retrouvez nos ${product.category.name} dans notre boutique.` : "Livraison soignée depuis notre boutique en ligne."}`
        : undefined;

    const title = product ? `${product.name} — pièce unique artisanale` : "Produit introuvable - Sacs à Bonheurs";
    const description = product?.metaDescription || fallbackDescription || undefined;

    if (!product) {
        return { title, description };
    }

    const images = (Array.isArray(product.images) ? product.images : [])
        .filter(Boolean)
        .map((url) => ({ url, alt: product.name }));

    return {
        title,
        description,
        alternates: { canonical: `/products/${slug}` },
        openGraph: {
            // Next's typed OpenGraph does not allow type: "product" and throws
            // during metadata resolution at build time. "website" is the valid
            // value; product-specific data is carried by the JSON-LD Product schema below.
            type: "website",
            url: `/products/${slug}`,
            title: product.name,
            description: description ?? undefined,
            images: images.length ? images : undefined,
            siteName: BRAND_NAME,
            locale: "fr_FR",
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) return notFound();

    const schemaObj = buildProductSchema(product);
    const breadcrumbObj = buildBreadcrumbSchema(product);

    return (
        <>
            {schemaObj && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }} />
            )}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbObj) }} />
            <ProductClient initialProduct={product} slug={slug} />
        </>
    );
}
