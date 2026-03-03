import { getProducts } from "@/lib/api/product";
import HomeClient from "../components/features/Home/HomeClient";
import HomeClientV2 from "@/components/features/Home/HomeClientV2";

export const metadata = {
  title: "Sacs à Bonheurs - Boutique artisanale de sacs faits en France",
  description:
    "Découvrez mes sacs artisanaux cousus en France avec passion. Élégance, durabilité et savoir-faire local.",
};

export default async function HomePage() {
  const products = await getProducts(4, true);

  return <HomeClientV2 initialProducts={products} />;
}
