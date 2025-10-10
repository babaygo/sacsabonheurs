"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import toast from "react-hot-toast";

async function deleteProduct(id: number) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const { error } = await res.json();
            throw new Error(error || "Erreur inconnue");
        }
        return res.json();
    } catch (error: any) {
        toast.error(error.message);
    }
}

export function DeleteDialog({ productId, onSuccess }: { productId: number, onSuccess: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} variant="destructive">
                    Supprimer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                </DialogHeader>
                <p>Ce produit sera définitivement supprimé.</p>
                <Button
                    className="w-full"
                    variant="destructive"
                    onClick={async () => {
                        const result = await deleteProduct(productId);
                        if (result) {
                            setOpen(false);
                            onSuccess();
                        }
                    }}
                >
                    Supprimer
                </Button>
            </DialogContent>
        </Dialog>
    );
}
