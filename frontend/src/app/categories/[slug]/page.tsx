import { notFound } from "next/navigation";

async function getProductsByCategory(slug: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${slug}/products`,
        { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = params; // 👈 plus besoin de await
    const products = await getProductsByCategory(slug);

    if (!products) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 capitalize">
                {slug.replace("-", " ")}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p: any) => (
                    <div key={p.id} className="border rounded-lg p-4 shadow-sm">
                        <img
                            src={JSON.parse(p.images)[0]}
                            alt={p.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h2 className="mt-2 font-semibold">{p.name}</h2>
                        <p className="text-gray-600 text-sm">{p.description}</p>
                        <p className="mt-1 font-bold">{p.price} €</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
