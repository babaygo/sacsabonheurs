import { getProducts } from "@/lib/api/product";
import { getFeaturedCollections } from "@/lib/api/collection";
import HomeClient from "@/components/features/Home/HomeClient";

export const metadata = {
  title: "Sacs à Bonheurs - Boutique artisanale de sacs faits en France",
  description:
    "Découvrez mes sacs artisanaux cousus en France avec passion. Élégance, durabilité et savoir-faire local.",
};

export default async function HomePage() {
  const [products, featuredCollections] = await Promise.all([
    getProducts(4, true),
    getFeaturedCollections(),
  ]);

  return <HomeClient initialProducts={products} featuredCollections={featuredCollections} />;
}
