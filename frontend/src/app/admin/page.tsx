"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, Handbag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@/components/SessionProvider";
import { useEffect } from "react";

export default function AdminHomePage() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role != "admin") {
                router.push("/");
            }
        }
    }, [user, loadingUser, router]);

    if (loadingUser) {
        return <p>Chargement...</p>;
    }

    return (
        <main className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord admin</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/orders">
                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PackageSearch className="w-5 h-5" />
                                Commandes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Voir, filtrer et gérer les commandes client.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/products">
                    <Card className="hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Handbag className="w-5 h-5" />
                                Produits
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Ajouter, supprimer, modifier les produits.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </main>
    );
}
