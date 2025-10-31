import ProductFiltersClient from "@/components/features/Product/ProductsFilters/ProductFiltersClient";
import BreadCrumb from "@/components/shared/BreadCrumb";
import { getProducts } from "@/lib/api/product";
import { Product } from "@/types/Product";

export const metadata = {
    title: "Boutique - Sacs à Bonheur",
    description: "Découvrez notre boutique de sacs artisanaux, alliant style et durabilité pour toutes les occasions.",
};

export default async function BoutiquePage() {
    let products = await getProducts();
    products = Array.isArray(products) ? products.filter((product: Product) => !product.hidden) : [];

    return (
        <div className="min-h-screen pt-4 px-4 md:px-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique" }
                ]}
            />

            <ProductFiltersClient products={products} />
        </div>
    );
}
