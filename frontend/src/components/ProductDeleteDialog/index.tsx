import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

async function deleteProduct(id: number) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`,
        {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        }
    );
    if (!res.ok) return null;
    return res.json();
}

export function DeleteDialog({ productId }: { productId: number }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Supprimer</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                </DialogHeader>
                <p>Ce produit sera définitivement supprimé.</p>
                <Button variant="destructive" onClick={() => deleteProduct(productId)}>
                    Supprimer
                </Button>
            </DialogContent>
        </Dialog>
    );
}
