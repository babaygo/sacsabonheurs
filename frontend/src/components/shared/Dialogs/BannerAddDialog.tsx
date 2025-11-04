"use client";

import { useState } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";

export function AddBannerDialog({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        message: "",
        variant: "primary",
        ctaLabel: "",
        ctaHref: "",
        dismissible: true,
        active: false,
    });

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/banners`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                setOpen(false);
                toast.error("Erreur dans l'ajout de la bannière");
                return;
            }

            setForm({ message: "", variant: "primary", ctaLabel: "", ctaHref: "", dismissible: true, active: false });
            setOpen(false);
            onSuccess();
            toast.success("Bannière ajoutée avec succès !");
        } catch (error: any) {
            console.error(error);
            toast.error("Erreur serveur");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Plus />
                    Ajouter une bannière
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une bannière</DialogTitle>
                    <DialogDescription>Remplissez les informations et cliquez sur "Enregistrer" pour ajouter la bannière.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Message</FieldLabel>
                            <Textarea required value={form.message} onChange={(e) => handleChange("message", e.target.value)} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Style</FieldLabel>
                                <Select value={form.variant} onValueChange={(v) => handleChange("variant", v)}>
                                    <SelectTrigger>{form.variant}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="primary">Primary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel>Nom du lien</FieldLabel>
                                <Input value={form.ctaLabel} onChange={(e) => handleChange("ctaLabel", e.target.value)} />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Lien</FieldLabel>
                            <Input value={form.ctaHref} onChange={(e) => handleChange("ctaHref", e.target.value)} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Faire disparaître</FieldLabel>
                                <Select value={String(form.dismissible)} onValueChange={(v) => handleChange("dismissible", v === 'true')}>
                                    <SelectTrigger>{form.dismissible ? 'Oui' : 'Non'}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Oui</SelectItem>
                                        <SelectItem value="false">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel>Active</FieldLabel>
                                <Select value={String(form.active)} onValueChange={(v) => handleChange("active", v === 'true')}>
                                    <SelectTrigger>{form.active ? 'Oui' : 'Non'}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Oui</SelectItem>
                                        <SelectItem value="false">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <Button type="submit" className="w-full">Enregistrer</Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
