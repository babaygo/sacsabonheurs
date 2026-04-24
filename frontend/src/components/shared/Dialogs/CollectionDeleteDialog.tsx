import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCollection } from "@/lib/api/collection";
import { Collection } from "@/types/Collection";
import { useState } from "react";
import toast from "react-hot-toast";

export function DeleteCollectionDialog({
    collection,
    onSuccess,
}: {
    collection: Collection;
    onSuccess: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Supprimer</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la collection{" "}
                        <strong>{collection.title}</strong> ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>

                <Button
                    className="w-full"
                    variant="destructive"
                    onClick={async () => {
                        const result = await deleteCollection(collection.id, collection.slug);
                        if (result) {
                            setOpen(false);
                            onSuccess();
                            toast.success("Collection supprimée avec succès !");
                        }
                    }}
                >
                    Supprimer
                </Button>
            </DialogContent>
        </Dialog>
    );
}
