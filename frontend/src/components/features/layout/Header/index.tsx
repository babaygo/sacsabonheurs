import HeaderClient from "./HeaderClient";
import { getCategoryLinks } from "@/lib/api/category";

export default async function Header() {
  const categories = await getCategoryLinks();
  return <HeaderClient categories={categories} />;
}
