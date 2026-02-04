import ProductClient from "@/components/features/Product/ProductClient";
import { getProductBySlug } from "@/lib/api/product";
import { notFound } from "next/navigation";

function sanitizeDescription(html?: string) {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function buildProductSchema(product: any) {
    const price = product?.isOnSale && product?.salePrice ? product.salePrice : product.price;
    const images = Array.isArray(product?.images) ? product.images : [];

    const schema: any = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product?.name || "",
        description: sanitizeDescription(product?.description),
        image: images,
        sku: product?.id ? String(product.id) : undefined,
        category: product?.category?.name || undefined,
        brand: product?.category?.name ? { "@type": "Brand", name: product.category.name } : undefined,
        offers: {
            "@type": "Offer",
            url: `/products/${product?.slug}`,
            priceCurrency: "EUR",
            price: price !== undefined ? String(price) : undefined,
            availability: product?.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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

    const schemaObj = buildProductSchema(product);

    return (
        <>
            {schemaObj && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }} />
            )}
            <ProductClient initialProduct={product} slug={slug} />
        </>
    );
}
