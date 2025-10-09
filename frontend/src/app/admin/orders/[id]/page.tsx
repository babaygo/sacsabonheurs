"use client";

import { notFound } from "next/navigation";
import { Order } from "@/types/Order"; // adapte si tu as un type enrichi
import { use, useEffect, useState } from "react";

async function getOrderById(id: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}`,
        {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        }
    );
    if (!res.ok) return null;
    return res.json();
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        getOrderById(id).then((data) => {
            if (!data) {
                notFound();
            } else {
                setOrder(data);
            }
        });
    }, [id]);

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Commande #{order?.id}</h1>

            <section className="mb-6">
                <p><strong>Date :</strong> {new Date(order?.createdAt!).toLocaleDateString()}</p>
                <p><strong>Client :</strong> {order?.user?.name ?? "—"} ({order?.user?.email})</p>
                <p><strong>Statut :</strong> {order?.status}</p>
                <p><strong>Total :</strong> {order?.total.toFixed(2)} €</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">Articles</h2>
                <ul className="space-y-2">
                    {order?.items.map((item) => (
                        <li key={item.id} className="border p-3 rounded">
                            <p><strong>{item.name}</strong></p>
                            <p>Quantité : {item.quantity}</p>
                            <p>Prix unitaire : {item.price.toFixed(2)} €</p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
