"use client";

import StatusBadge from "@/components/StatusBadge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <Table>
            <TableCaption>Historique de vos commandes</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Numéro de commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status de la commande</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order: Order) => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                            {order.createdAt
                                ? new Date(order.createdAt).toLocaleString("fr-FR", {
                                    timeZone: "Europe/Paris",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "—"}
                        </TableCell>
                        <TableCell>
                            <StatusBadge
                                status={order.status}
                                clickable={false}
                            />
                        </TableCell>
                        <TableCell>
                            {order.total.toFixed(2)} €
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
