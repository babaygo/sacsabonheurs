import { Product } from "@/types/Product";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function EditDialog({ product, onSuccess }: { product: Product, onSuccess: () => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Modifier</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier {product.name}</DialogTitle>
                </DialogHeader>
                <form>{/* prérempli avec product */}</form>
            </DialogContent>
        </Dialog>
    );
}
