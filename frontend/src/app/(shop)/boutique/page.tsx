import Link from "next/link";
import BreadCrumb from "@/components/shared/BreadCrumb";
import ProductFiltersClient from "@/components/features/Product/ProductsFilters/ProductFiltersClient";
import { getProducts } from "@/lib/api/product";
import { getCategoryLinks } from "@/lib/api/category";
import { SITE_URL } from "@/lib/seo/seo";

export const metadata = {
    title: "Sacs artisanaux faits main en France — liège, jacquard, suédine | Sacs à Bonheurs",
    description:
        "La boutique de Sacs à Bonheurs : sacs et pochettes cousus main à Saint-Nazaire en liège vegan, jacquard et suédine. Pièces uniques, prix accessibles, livraison en France.",
    alternates: { canonical: "/boutique" },
    openGraph: {
        url: "/boutique",
        title: "Sacs artisanaux faits main en France — liège, jacquard, suédine | Sacs à Bonheurs",
        description:
            "La boutique de Sacs à Bonheurs : sacs et pochettes cousus main à Saint-Nazaire en liège vegan, jacquard et suédine. Pièces uniques, prix accessibles, livraison en France.",
    },
};

export default async function BoutiquePage() {
    const [initialProducts, categories] = await Promise.all([
        getProducts(24, true),
        getCategoryLinks(),
    ]);

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: initialProducts.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/products/${product.slug}`,
            name: product.name,
        })),
    };

    return (
        <div className="min-h-screen pt-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique" },
                ]}
            />
            <header className="mb-8 max-w-4xl">
                <h1 className="mb-4">Sacs artisanaux faits main en France</h1>
                <div className="space-y-3 text-body leading-relaxed text-foreground/80 text-justify">
                    <p>
                        Découvrez toutes les créations de Sacs à Bonheurs : des sacs, sacoches
                        et pochettes cousus à la main dans mon atelier de Saint-Nazaire, en
                        Loire-Atlantique. Chaque pièce est fabriquée en exemplaire unique, 
                        un modèle ne sera jamais reproduit à l&apos;identique.
                    </p>
                    <p>
                        Je travaille trois matières signature : le{" "}
                        <Link href="/collections/liege" className="text-primary underline underline-offset-2">
                            liège naturel et vegan
                        </Link>
                        , le{" "}
                        <Link href="/collections/jacquard" className="text-primary underline underline-offset-2">
                            jacquard tissé
                        </Link>{" "}
                        et la{" "}
                        <Link href="/collections/suedine" className="text-primary underline underline-offset-2">
                            suédine
                        </Link>{" "}
                        douce. Des sacs élégants, durables et responsables, à des prix
                        accessibles, livrés partout en France.
                    </p>
                </div>
            </header>
            {categories.length > 0 && (
                <nav aria-label="Parcourir par type de sac" className="mb-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        Parcourir par type de sac
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <li key={category.slug}>
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="inline-block rounded-full border border-border bg-background px-4 py-1.5 text-sm hover:border-primary hover:text-primary transition-colors"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
            <ProductFiltersClient initialProducts={initialProducts} />
        </div>
    );
}
