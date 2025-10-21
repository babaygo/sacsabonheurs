"use client";

import BreadCrumb from "@/components/BreadCrumb";
import StatusBadge from "@/components/StatusBadge";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Order } from "@/types/Order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersClient() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
            const data = await getUserOrders();

            setOrders(data ?? []);
            setLoading(false);
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen justify-center items-center">
                <p className="flex space-x-2"><Spinner />Chargement des commandes ...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen py-12 text-center">
                <BreadCrumb
                    items={[
                        { label: "Accueil", href: "/" },
                        { label: "Mes commandes", }
                    ]}
                />
                <h1 className="text-2xl font-bold mb-4">Aucune commande trouvée</h1>
                <p className="text-gray-600">
                     Vous n'avez pas encore passé de commande.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Mes commandes", }
                ]}
            />
            <h1 className="text-2xl font-bold">Historique des commandes</h1>
            <div className="py-4 w-full">
                <Table>
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
                            <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
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
            </div>
        </div>
    );
}
