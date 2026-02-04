"use client";

import { AddTarifLivraisonDialog } from "@/components/shared/Dialogs/TarifLivraisonAddDialog";
import { ArchiveTarifLivraisonDialog } from "@/components/shared/Dialogs/TarifLivraisonArchiveDialog";
import { EditTarifLivraisonDialog } from "@/components/shared/Dialogs/TarifLivraisonEditDialog";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTarifsLivraisons } from "@/hooks/useTarifsLivraisons";
import { ShippingRate } from "@/types/ShippingRate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminTarifsLivraisonsClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();

    const {
        tarifsLivraisons,
        loadingTarifsLivraisons,
        errorTarifsLivraisons,
        refreshTarifsLivraisons,
    } = useTarifsLivraisons();

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role !== "admin") {
                router.push("/");
            }
        }
    }, [user, loadingUser, router]);

    if (loadingUser || loadingTarifsLivraisons) return <Spinner className="min-h-screen" />;
    if (errorTarifsLivraisons) { toast.error(errorTarifsLivraisons); }
    
    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <div className="flex justify-between">
                    <h1 className="text-3xl sm:text-4xl font-bold">Tarifs de livraisons</h1>
                    <AddTarifLivraisonDialog onSuccess={refreshTarifsLivraisons} />
                </div>

                {tarifsLivraisons.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tarifsLivraisons.map((tarifLivraison: ShippingRate) => (
                                <TableRow key={tarifLivraison.id}>
                                    <TableCell>{tarifLivraison.display_name}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <EditTarifLivraisonDialog
                                            tarif={tarifLivraison}
                                            onSuccess={refreshTarifsLivraisons}
                                        />
                                        <ArchiveTarifLivraisonDialog
                                            tarifId={tarifLivraison.id}
                                            label={tarifLivraison.display_name}
                                            onSuccess={refreshTarifsLivraisons}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>Aucun tarif de livraison disponible.</p>
                )}
            </div>
        </div>
    );
}