import BreadCrumb from "@/components/shared/BreadCrumb";
import ProductFiltersClient from "@/components/features/Product/ProductsFilters/ProductFiltersClient";
import { getProducts } from "@/lib/api/product";

export const metadata = {
    title: "Boutique - Sacs à Bonheur",
    description:
        "Découvrez notre boutique de sacs artisanaux, alliant style et durabilité pour toutes les occasions.",
};

export default async function BoutiquePage() {
    const initialProducts = await getProducts();

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Boutique" },
                ]}
            />
            <h1 className="text-2xl font-bold capitalize">Boutique</h1>
            <ProductFiltersClient initialProducts={initialProducts} />
        </div>
    );
}
