"use client";

import { useState } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import { ShippingRate } from "@/types/ShippingRate";

export function EditTarifLivraisonDialog({ tarif, onSuccess, }: { tarif: ShippingRate; onSuccess: () => void; }) {
    const [open, setOpen] = useState(false);
    const [metadata, setMetadata] = useState<Record<string, string>>(
        tarif.metadata ?? {}
    );
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate/${tarif.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ metadata }),
            });

            if (!res.ok) {
                toast.error("Erreur lors de la mise à jour des métadonnées");
                setOpen(false);
                return;
            }

            toast.success("Métadonnées mises à jour !");
            setOpen(false);
            onSuccess();
        } catch (error) {
            toast.error("Erreur serveur");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Pencil />
                    Modifier
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le mode de livraison</DialogTitle>
                    <DialogDescription>
                        Tu peux modifier le mode livraison.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Mode de livraison Mondial Relay</FieldLabel>
                            <Select
                                value={metadata.ColLivMod ?? ""}
                                onValueChange={(value) =>
                                    setMetadata((prev) => ({ ...prev, ColLivMod: value }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choisir un mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="APM">Locker (APM)</SelectItem>
                                        <SelectItem value="REL">Point relais (REL)</SelectItem>
                                        <SelectItem value="NDEL">Pas de livraison</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Button type="submit" className="w-full mt-4">
                            Enregistrer la modification
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
