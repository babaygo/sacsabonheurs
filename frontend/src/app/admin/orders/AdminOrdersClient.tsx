"use client";

import { useSessionContext } from "@/components/SessionProvider";
import StatusBadge from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ErrorView } from "@/components/Views/ErrorView";
import { LoadingView } from "@/components/Views/LoadingView";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Order } from "@/types/Order";
import { OrderStatusType } from "@/types/OrderStatusType";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function AdminOrdersClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([]);

    const updateOrderStatus = async (orderId: number, newStatus: OrderStatusType) => {
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/orders/${orderId}/status`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Erreur mise à jour statut commande :", await res.text());
                return <ErrorView error="Impossible de mettre à jour le status" />;;
            }

            const updatedOrders = await getOrders();
            setOrders(updatedOrders ?? []);
            toast.success("Statut mis à jour !");
        } catch (err) {
            console.error("Erreur réseau ou serveur :", err);
            notFound();
        }
    };

    async function getOrders() {
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/orders`, {
                credentials: "include",
            });
            if (!res.ok) {
                console.error("Erreur API :", res.status, await res.text());
                return <ErrorView error="Impossible de charger les commandes." />;
            }
            return res.json();
        } catch (err) {
            console.error("Erreur réseau :", err);
            notFound();
        }
    }

    useEffect(() => {
        if (loadingUser) return;
        if (user?.role !== "admin") {
            router.push("/");
            return;
        }

        getOrders().then((data) => setOrders(data ?? []));
    }, [user, loadingUser, router]);

    if (loadingUser) return <LoadingView />;

    return (
        <div className="min-h-screen pt-4">
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
                        <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
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
        </div>
    );
}
