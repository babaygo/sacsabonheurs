"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeRestockAlert } from "@/lib/api/product";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RestockNotifyForm({ slug }: { slug: string }) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        try {
            await subscribeRestockAlert(slug, email.trim());
            setSubmitted(true);
            toast.success("C'est noté ! Vous serez prévenu(e) dès son retour.");
        } catch (err: any) {
            toast.error(err.message || "Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                    Votre alerte est enregistrée. Nous vous enverrons un email dès que cette pièce
                    sera de nouveau disponible.
                </span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <label htmlFor="restock-email" className="text-sm font-medium">
                Prévenez-moi quand elle revient
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    id="restock-email"
                    type="email"
                    required
                    disabled={isLoading}
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading} variant="default">
                    {isLoading ? "Envoi..." : "Me prévenir"}
                </Button>
            </div>
        </form>
    );
}
