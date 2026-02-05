"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch, Handbag, Scale, ListTree, RectangleEllipsis, TruckElectric, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@/components/shared/SessionProvider";
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
        return null;
    }

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-bold">Tableau de bord admin</h1>

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

                <Link href="/admin/categories" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListTree className="w-5 h-5" />
                                Catégories
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Ajouter, supprimer, modifier les catégories des produits.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/banners" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RectangleEllipsis className="w-5 h-5" />
                                Bannières
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Ajouter, supprimer, modifier les bannières.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/articles" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Ajouter, supprimer, modifier les articles de blog.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/tarifs-livraisons" className="h-full w-full">
                    <Card className="h-full w-full hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TruckElectric className="w-5 h-5" />
                                Tarifs livraisons
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Ajouter, archiver, modifier les tarifs livraisons.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
