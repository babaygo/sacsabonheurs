"use client";

import { TarifLivraisonDialog } from "@/components/shared/Dialogs/TarifLivraisonDialog";
import { ArchiveTarifLivraisonDialog } from "@/components/shared/Dialogs/TarifLivraisonArchiveDialog";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTarifsLivraisons } from "@/hooks/useTarifsLivraisons";
import { ShippingRate } from "@/types/ShippingRate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminTarifsLivraisonsClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTarif, setSelectedTarif] = useState<ShippingRate | null>(null);

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

    const handleAdd = () => {
        setSelectedTarif(null);
        setOpenDialog(true);
    };

    const handleEdit = (tarif: ShippingRate) => {
        setSelectedTarif(tarif);
        setOpenDialog(true);
    };
    
    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <div className="flex justify-between">
                    <h1>Tarifs de livraisons</h1>
                    <Button variant="outline" onClick={handleAdd}>
                        <Plus />
                        Ajouter un tarif livraison
                    </Button>
                </div>

                <TarifLivraisonDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    tarif={selectedTarif}
                    onSave={refreshTarifsLivraisons}
                />

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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(tarifLivraison)}
                                        >
                                            Modifier
                                        </Button>
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