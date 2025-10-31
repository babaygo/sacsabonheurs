"use client"

import { Product } from "@/types/Product";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddDialog } from "@/components/shared/Dialogs/ProductAddDialog";
import { EditDialog } from "@/components/shared/Dialogs/ProductEditDialog";
import { DeleteDialog } from "@/components/shared/Dialogs/ProductDeleteDialog";
import { getProducts } from "@/lib/api/product";

export default function AdminProducts() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        setProducts(await getProducts());
    };

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role != "admin") {
                router.push("/");
            }

            fetchProducts();
        }
    }, [user, loadingUser, router]);

    if (loadingUser) return null;

    return (
        <div className="min-h-screen pt-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Produits</h1>
                <AddDialog onSuccess={fetchProducts} />
            </div>

            <div className="grid grid-cols-5 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="p-4 space-y-2">
                        <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded" />
                        <h2 className="text-lg font-semibold">{product.name}</h2>

                        <div className="flex gap-2 mt-2">
                            <EditDialog product={product} onSuccess={fetchProducts} />
                            <DeleteDialog productId={product.id} onSuccess={fetchProducts} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}