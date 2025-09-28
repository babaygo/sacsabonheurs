import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    cache: "no-store"
  });
  return res.json();
}

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="bg-white">
      <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo Sacs à Bonheur" className="h-10 w-10" />
          <Link href="/" className="text-xl">
            Sacs à Bonheur
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="text-gray-700 hover:text-black"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <a href="/cart" className="group -m-2 flex items-center p-2">
          <ShoppingCartIcon
            className="size-6 text-gray-400 group-hover:text-gray-500"
          />
        </a>
      </div>
    </header>
  );
}
