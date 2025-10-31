import { getProducts } from "@/lib/api/product";
import HomeClient from "../components/features/Home/HomeClient";
import { Product } from "@/types/Product";

export const metadata = {
  title: "Sacs à Bonheurs - Boutique artisanale de sacs faits en France",
  description:
    "Découvrez mes sacs artisanaux cousus en France avec passion. Élégance, durabilité et savoir-faire local.",
};

export default async function HomePage() {
  let products = await getProducts();
  products = products.filter((product: Product) => !product.hidden)
    .sort((a: Product, b: Product) => new Date(b.createdAt).getTime() - new Date(a.createdAt)
      .getTime()).slice(0, 4);

  return <HomeClient products={products} />;
}
