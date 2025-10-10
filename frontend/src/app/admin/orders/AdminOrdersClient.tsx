"use client";

import { useSessionContext } from "@/components/SessionProvider";
import StatusBadge from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Order } from "@/types/Order";
import { OrderStatusType } from "@/types/OrderStatusType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function AdminOrdersClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([]);

    const updateOrderStatus = async (orderId: number, newStatus: OrderStatusType) => {
        await fetch(`${getBaseUrl()}/api/admin/orders/${orderId}/status`, {
            method: "PUT",
            body: JSON.stringify({ status: newStatus }),
            headers: { "Content-Type": "application/json" },
        });
        // Optionnel : recharger les données ou mettre à jour localement
    };

    async function getOrders() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/orders`, {
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
        if (!loadingUser) {
            if (user?.role != "admin") {
                router.push("/");
            } else {
                const fetchOrders = async () => {
                    const data = await getOrders();

                    setOrders(data ?? []);
                }
                fetchOrders();
            }
        }
    }, [user, loadingUser, router]);

    if (loadingUser) {
        return <p>Chargement...</p>;
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Commandes</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date de commande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{order.user?.email ?? "—"}</TableCell>
                            <TableCell>{order.total.toFixed(2)} €</TableCell>
                            <TableCell>
                                <StatusBadge
                                    status={order.status}
                                    onChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main>
    );
}
