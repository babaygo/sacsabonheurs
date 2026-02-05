"use client";

import { useState, useEffect } from "react";
import { Banner } from "@/types/Banner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { createBanner, updateBanner } from "@/lib/api/banner";
import toast from "react-hot-toast";

interface BannerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner?: Banner | null;
    onSave: () => void;
}

export function BannerDialog({ open, onOpenChange, banner, onSave }: BannerDialogProps) {
    const [form, setForm] = useState({
        message: "",
        variant: "primary",
        ctaLabel: "",
        ctaHref: "",
        dismissible: true,
        active: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (banner) {
            setForm({
                message: banner.message,
                variant: banner.variant,
                ctaLabel: banner.ctaLabel || "",
                ctaHref: banner.ctaHref || "",
                dismissible: banner.dismissible,
                active: banner.active,
            });
        } else {
            setForm({
                message: "",
                variant: "primary",
                ctaLabel: "",
                ctaHref: "",
                dismissible: true,
                active: false,
            });
        }
        setError(null);
    }, [banner, open]);

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.message.trim()) {
            setError("Le message est requis");
            return;
        }

        try {
            setLoading(true);
            
            if (banner) {
                // UPDATE
                await updateBanner(banner.id, {
                    message: form.message,
                    variant: form.variant,
                    ctaLabel: form.ctaLabel,
                    ctaHref: form.ctaHref,
                    dismissible: form.dismissible,
                    active: form.active,
                });
                toast.success("Bannière modifiée avec succès !");
            } else {
                // CREATE
                await createBanner({
                    message: form.message,
                    variant: form.variant,
                    ctaLabel: form.ctaLabel,
                    ctaHref: form.ctaHref,
                    dismissible: form.dismissible,
                    active: form.active,
                });
                toast.success("Bannière ajoutée avec succès !");
            }

            onOpenChange(false);
            onSave();
        } catch (err: any) {
            const errorMsg = err.message || "Erreur lors de l'enregistrement";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {banner ? "Modifier la bannière" : "Ajouter une bannière"}
                    </DialogTitle>
                    <DialogDescription>
                        {banner ? "Modifiez les informations puis cliquez sur \"Enregistrer\"." : "Remplissez les informations et cliquez sur \"Enregistrer\" pour ajouter la bannière."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Message</FieldLabel>
                            <Textarea
                                required
                                value={form.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                                disabled={loading}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Style</FieldLabel>
                                <Select
                                    value={form.variant}
                                    onValueChange={(v) => handleChange("variant", v)}
                                    disabled={loading}
                                >
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
                                <Input
                                    value={form.ctaLabel}
                                    onChange={(e) => handleChange("ctaLabel", e.target.value)}
                                    disabled={loading}
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Lien</FieldLabel>
                            <Input
                                value={form.ctaHref}
                                onChange={(e) => handleChange("ctaHref", e.target.value)}
                                disabled={loading}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Faire disparaître</FieldLabel>
                                <Select
                                    value={String(form.dismissible)}
                                    onValueChange={(v) => handleChange("dismissible", v === "true")}
                                    disabled={loading}
                                >
                                    <SelectTrigger>{form.dismissible ? "Oui" : "Non"}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Oui</SelectItem>
                                        <SelectItem value="false">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel>Active</FieldLabel>
                                <Select
                                    value={String(form.active)}
                                    onValueChange={(v) => handleChange("active", v === "true")}
                                    disabled={loading}
                                >
                                    <SelectTrigger>{form.active ? "Oui" : "Non"}</SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Oui</SelectItem>
                                        <SelectItem value="false">Non</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {banner ? "Modifier" : "Ajouter"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
