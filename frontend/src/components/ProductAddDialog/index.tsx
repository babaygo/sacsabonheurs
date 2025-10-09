import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function AddDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Ajouter un sac</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un sac</DialogTitle>
                </DialogHeader>
                <form>{/* champs + bouton submit */}</form>
            </DialogContent>
        </Dialog>
    );
}
