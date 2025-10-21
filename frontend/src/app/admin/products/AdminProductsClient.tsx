"use client"

import { Product } from "@/types/Product";
import { useSessionContext } from "@/components/SessionProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { AddDialog } from "@/components/Dialogs/ProductAddDialog";
import { EditDialog } from "@/components/Dialogs/ProductEditDialog";
import { DeleteDialog } from "@/components/Dialogs/ProductDeleteDialog";
import { LoadingView } from "@/components/Views/LoadingView";

export default function AdminProducts() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([]);

    async function getProducts() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/products`);
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
            }

            refreshProducts();
        }
    }, [user, loadingUser, router]);

    if (loadingUser) return <LoadingView />;

    return (
        <div className="p-6">
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
        </div>
    );
}