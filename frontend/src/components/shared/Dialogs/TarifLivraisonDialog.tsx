"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { ShippingRate } from "@/types/ShippingRate";
import { AlertCircle } from "lucide-react";
import { createShippingRate, updateShippingRate } from "@/lib/api/shippingRate";

interface TarifLivraisonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tarif?: ShippingRate | null;
    onSave: () => void;
}

const emptyForm = {
    display_name: "",
    amount: "",
    min_delivery: "",
    max_delivery: "",
    tax_behavior: "inclusive",
    currency: "eur",
    ColLivMod: "",
};

export function TarifLivraisonDialog({
    open,
    onOpenChange,
    tarif,
    onSave,
}: TarifLivraisonDialogProps) {
    const [form, setForm] = useState(emptyForm);
    const [metadata, setMetadata] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const isEditMode = !!tarif;

    useEffect(() => {
        if (open) {
            if (isEditMode && tarif) {
                setForm({
                    display_name: tarif.display_name,
                    amount: "",
                    min_delivery: "",
                    max_delivery: "",
                    tax_behavior: "inclusive",
                    currency: "eur",
                    ColLivMod: tarif.metadata?.ColLivMod || "",
                });
                setMetadata(tarif.metadata ?? {});
            } else {
                setForm(emptyForm);
                setMetadata({});
            }
            setError("");
            setIsLoading(false);
        }
    }, [open, tarif, isEditMode]);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (isEditMode && tarif) {
                // Edit mode - only update metadata
                await updateShippingRate(tarif.id, {
                    metadata: {
                        ...metadata,
                        ColLivMod: form.ColLivMod,
                    },
                });

                toast.success("Métadonnées mises à jour !");
            } else {
                // Add mode - create new tarif
                const formData = new FormData();
                Object.entries(form).forEach(([key, value]) => {
                    if (key === "amount") {
                        const centimes = Math.round(parseFloat(String(value)) * 100);
                        formData.append(key, String(centimes));
                    } else {
                        formData.append(key, String(value));
                    }
                });

                formData.append("metadata[ColLivMod]", form.ColLivMod);
                formData.delete("ColLivMod");

                await createShippingRate(formData);

                setForm(emptyForm);
                setMetadata({});
                toast.success("Tarif de livraison ajouté avec succès !");
            }

            onOpenChange(false);
            onSave();
        } catch (err: any) {
            const errorMsg = err.message || "Erreur serveur";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Modifier le mode de livraison" : "Ajouter un tarif de livraison"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Tu peux modifier le mode livraison."
                            : "Remplissez les informations pour créer un tarif Stripe."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        {!isEditMode && (
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <Input
                                        value={form.display_name}
                                        disabled={isLoading}
                                        required
                                        onChange={(e) =>
                                            handleChange("display_name", e.target.value)
                                        }
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Montant (€)</FieldLabel>
                                    <Input
                                        type="number"
                                        step="any"
                                        min={0}
                                        value={form.amount}
                                        disabled={isLoading}
                                        required
                                        onChange={(e) =>
                                            handleChange("amount", e.target.value)
                                        }
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Délai min (jours ouvrables)</FieldLabel>
                                    <Input
                                        type="number"
                                        disabled={isLoading}
                                        value={form.min_delivery}
                                        onChange={(e) =>
                                            handleChange("min_delivery", e.target.value)
                                        }
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Délai max (jours ouvrables)</FieldLabel>
                                    <Input
                                        type="number"
                                        disabled={isLoading}
                                        value={form.max_delivery}
                                        onChange={(e) =>
                                            handleChange("max_delivery", e.target.value)
                                        }
                                    />
                                </Field>
                            </div>
                        )}

                        <div className="w-full">
                            <Field>
                                <FieldLabel>Mode de livraison Mondial Relay</FieldLabel>
                                <Select
                                    disabled={isLoading}
                                    value={form.ColLivMod}
                                    onValueChange={(value) =>
                                        handleChange("ColLivMod", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir un mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="APM">
                                                Locker (APM)
                                            </SelectItem>
                                            <SelectItem value="REL">
                                                Point relais (REL)
                                            </SelectItem>
                                            <SelectItem value="NDEL">
                                                Pas de livraison
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4"
                        >
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
