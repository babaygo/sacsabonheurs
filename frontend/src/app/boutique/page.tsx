import { getBaseUrl } from "@/lib/getBaseUrl";
import { Category } from "@/types/Category";

export default async function BoutiquePage() {
    const res = await fetch(`${getBaseUrl()}/categories/first-product-by-categories`, {
        credentials: "include"
    });
    const categories = await res.json();

    return (
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Types de sacs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat: Category) => {
                    const product = cat.products[0];
                    if (!product) return null;

                    return (
                        <a
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group border rounded-lg p-4 hover:shadow transition"
                        >
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded"
                            />
                            <h2 className="mt-2 text-xl font-semibold">{cat.name}</h2>
                        </a>
                    );
                })}
            </div>
        </main>
    );
}
