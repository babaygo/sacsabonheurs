"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Category } from "@/types/Category";

async function deleteCategory(id: number) {
    try {
        const res = await fetch(
            `${getBaseUrl()}/api/admin/categories/${id}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
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

export function DeleteCategoryDialog({ category, onSuccess }: { category: Category, onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const categoryId = category.id;

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
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette catégorie ?
                    </DialogDescription>
                </DialogHeader>
                {category.products?.length > 0 ? (
                    <div>
                        <p>
                            Cette catégorie sera définitivement supprimée, ainsi que les {category.products.length} produit(s) rattaché(s).
                        </p>
                        <div className="mt-4 space-y-1">
                            <p className="font-semibold">Produits concernés :</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {category.products.map((product) => (
                                    <li key={product.id}>{product.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p>Cette catégorie sera définitivement supprimée.</p>
                )}

                <Button
                    className="w-full"
                    variant="destructive"
                    onClick={async () => {
                        const result = await deleteCategory(categoryId);
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
