"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, Handbag, Scale } from "lucide-react";
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
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord admin</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/orders" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
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

                <Link href="/admin/products" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
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

                <Link href="/admin/legal" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="w-5 h-5" />
                                Légal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Saisir les Mentions légales, les Conditions générales et la Politique de confidentialité.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
