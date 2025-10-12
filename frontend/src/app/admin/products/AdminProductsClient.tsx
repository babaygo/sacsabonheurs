"use client"

import { AddDialog } from "@/components/ProductAddDialog";
import { EditDialog } from "@/components/ProductEditDialog";
import { Product } from "@/types/Product";
import { DeleteDialog } from "@/components/ProductDeleteDialog";
import { useSessionContext } from "@/components/SessionProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/getBaseUrl";

export default function AdminProducts() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([]);
    let imageSrc;

    async function getProducts() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/products`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            });
            if (!res.ok) {
                console.error("Erreur API :", res.status, await res.text());
                return [];
            }
            return res.json();
        } catch (err) {
            console.error("Erreur réseau :", err);
            return [];
        }
    }

    const refreshProducts = async () => {
        const data = await getProducts();
        setProducts(data ?? []);
    };

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role != "admin") {
                router.push("/");
            } else {
                const fetchProducts = async () => {
                    refreshProducts();
                }
                fetchProducts();
            }
        }
    }, [user, loadingUser, router]);

    if (loadingUser) {
        return <p>Chargement...</p>;
    }

    return (
        <main className="p-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Produits</h1>
                <AddDialog onSuccess={refreshProducts} />
            </div>

            <div className="grid grid-cols-5 gap-6">
                {products.map((product) => (

                    <div key={product.id} className="border rounded p-4 space-y-2">
                        <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded" />
                        <h2 className="text-lg font-semibold">{product.name}</h2>

                        <div className="flex gap-2 mt-2">
                            <EditDialog product={product} onSuccess={refreshProducts} />
                            <DeleteDialog productId={product.id} onSuccess={refreshProducts} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}