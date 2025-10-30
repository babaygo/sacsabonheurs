'use client';

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Order } from "@/types/Order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Separator } from "@/components/ui/separator";
import { OrderStatusType } from "@/lib/constants/OrderStatusType";
import BreadCrumb from "@/components/shared/BreadCrumb";

const statusMap: Record<OrderStatusType, { label: string; color: string }> = {
    pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    shipped: { label: "Expédiée", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Livrée", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

export default function OrderPage() {
    const { id } = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { label, color } = order ? statusMap[order.status] : { label: "", color: "" };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/api/order/${id}`, {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) {
                    console.error("Erreur API :", res.status, await res.text());
                    notFound();
                }

                const data = await res.json();
                setOrder(data);
            } catch (err) {
                console.error("Erreur réseau :", err);
                notFound();
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id, router]);

    if (loading) {
        return null;
    }

    if (!order) return notFound();

    return (
        <div className="min-h-screen pt-4">
            <BreadCrumb
                items={[
                    { label: "Accueil", href: "/" },
                    { label: "Mes Commandes", href: "/orders" },
                    { label: `Commande #${order.id}` }
                ]}
            />
            <h1 className="text-2xl font-bold mb-4">Détails de la commande #{order.id}</h1>
            <div className="flex items-center mb-2 space-x-10">
                <p className=" text-sm text-muted-foreground">
                    Date de la commande : {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </p>
                Status de la commande :&nbsp;
                <p className={`text-sm ${color}`}>
                    {label}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Quantité</TableHead>
                                    <TableHead>Prix Unitaire</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.price.toFixed(2)} €</TableCell>
                                        <TableCell>{(item.price * item.quantity).toFixed(2)} €</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-semibold">Sous-total</span>
                            <span>{order.subtotal!.toFixed(2)} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="font-semibold">Frais de livraison</span>
                            <span>{order.shippingCost!.toFixed(2)} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>{order.total.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-4 text-sm">
                    <div>
                        <p className="font-semibold">Mode de livraison :</p>
                        <p>{order.shippingOption === "REL" ? "Point relais" : "Locker"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Adresse de livraison :</p>
                        <p>{order.relayName}</p>
                        <p>{order.relayAddress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
