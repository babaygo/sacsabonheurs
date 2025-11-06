"use client";

import { useState } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Archive, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function ArchiveTarifLivraisonDialog({
    tarifId,
    label,
    onSuccess,
}: {
    tarifId: string;
    label: string;
    onSuccess: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleArchive = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate/${tarifId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ active: false }),
            });

            if (!res.ok) {
                toast.error("Erreur lors de l'archivage du tarif");
                setOpen(false);
                return;
            }

            toast.success("Tarif archivé avec succès !");
            setOpen(false);
            onSuccess();
        } catch (error) {
            toast.error("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Archive />
                    Archiver
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archiver le tarif de livraison</DialogTitle>
                    <DialogDescription>
                        Cette action désactivera le tarif de livraison <strong>{label}</strong>.<br /> Il ne sera plus proposé au checkout.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleArchive} disabled={loading}>
                        Archiver
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
