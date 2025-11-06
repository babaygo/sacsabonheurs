"use client";

import { useState } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddTarifLivraisonDialog({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        display_name: "",
        amount: "",
        min_delivery: "",
        max_delivery: "",
        tax_behavior: "inclusive",
        currency: "eur",
        ColLivMod: ""
    });

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/shipping-rate`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                setOpen(false);
                toast.error("Erreur dans l'ajout du tarif de livraison");
                return;
            }

            const data = await res.json();

            if (data.success) {
                setForm({
                    display_name: "",
                    amount: "",
                    min_delivery: "",
                    max_delivery: "",
                    tax_behavior: "exclusive",
                    currency: "eur",
                    ColLivMod: ""
                });
                setOpen(false);
                onSuccess();
                toast.success("Tarif de livraison ajouté avec succès !");
            }
        } catch (error: any) {
            toast.error("Erreur serveur");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Plus />
                    Ajouter un tarif livraison
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un tarif de livraison</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations pour créer un tarif Stripe.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Input
                                    value={form.display_name}
                                    required
                                    onChange={(e) => handleChange("display_name", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Montant (€)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.amount}
                                    required
                                    onChange={(e) => handleChange("amount", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Délai min (jours ouvrables)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.min_delivery}
                                    onChange={(e) => handleChange("min_delivery", e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Délai max (jours ouvrables)</FieldLabel>
                                <Input
                                    type="number"
                                    value={form.max_delivery}
                                    onChange={(e) => handleChange("max_delivery", e.target.value)}
                                />
                            </Field>
                        </div>

                        <div className="w-full">
                            <Field>
                                <FieldLabel>Mode de livraison Mondial Relay</FieldLabel>
                                <Select
                                    value={form.ColLivMod}
                                    onValueChange={(value) => handleChange("ColLivMod", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir un mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem className="cursor-pointer" value="APM">Locker (APM)</SelectItem>
                                            <SelectItem className="cursor-pointer" value="REL">Point relais (REL)</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <Button type="submit" className="w-full mt-4">
                            Enregistrer
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
