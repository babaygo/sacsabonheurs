"use client";

import { getBaseUrl } from "@/lib/getBaseUrl";
import { Order } from "@/types/Order";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    async function getLastOrderBySessionId(sessionId: string) {
        try {
            const res = await fetch(
                `${getBaseUrl()}/api/order-by-session-id?session_id=${sessionId}`, {
                credentials: "include"
            }
            );
            if (!res.ok) {
                console.error("Erreur API :", res.status, await res.text());
                return null;
            }
            const order = await res.json();
            return order ? [order] : [];
        } catch (err) {
            console.error("Erreur réseau :", err);
            return [];
        }
    }

    async function getUserOrders() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/orders`, {
                credentials: "include",
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

    useEffect(() => {
        const fetchOrders = async () => {
            const data = sessionId
                ? await getLastOrderBySessionId(sessionId)
                : await getUserOrders();

            setOrders(data ?? []);
            setLoading(false);
        };

        fetchOrders();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Aucune commande trouvée</h1>
                <p className="text-gray-600">
                    {sessionId
                        ? "Aucune commande associée à cette session."
                        : "Vous n’avez pas encore passé de commande."}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 space-y-8">
            {orders.map((order) => (
                <div key={order.id}>
                    <h1 className="text-2xl font-bold mb-4">
                        {sessionId ? "Merci pour votre commande !" : `Commande n° ${order.id}`}
                    </h1>
                    <p className="text-gray-700 mb-2">Email : {order.email}</p>
                    <p className="text-gray-700 mb-2">Montant total : {order.total.toFixed(2)} €</p>
                    <p className="text-gray-700 mb-6">
                        Date : {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </p>

                    <div className="space-y-4">
                        {order.items?.map((item) => (
                            <div key={item.id} className="border rounded p-4">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                                <p className="text-sm text-gray-600">Prix : {item.price.toFixed(2)} €</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
