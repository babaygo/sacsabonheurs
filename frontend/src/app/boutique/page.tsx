import BreadCrumb from "@/components/BreadCrumb";
import PreviewProduct from "@/components/Product/PreviewProduct";
import ProductFiltersClient from "@/components/Product/ProductsFilters/ProductFiltersClient";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Product } from "@/types/Product";

export const metadata = {
    title: "Boutique - Sacs à Bonheur",
    description: "Découvrez notre boutique de sacs artisanaux, alliant style et durabilité pour toutes les occasions.",
};

async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`, {
            cache: "no-store"
        });

        if (!res.ok) {
            console.error("Erreur API produits :", res.status);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err: any) {
        console.error("Erreur réseau produits :", err.message);
        return [];
    }
}

export default async function BoutiquePage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique" }
                ]}
            />

            <ProductFiltersClient products={products} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <PreviewProduct key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
