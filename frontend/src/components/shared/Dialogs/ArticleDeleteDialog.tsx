import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { deleteArticle } from "@/lib/api/article";
import { Article } from "@/types/Article";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function DeleteArticleDialog({ article, onSuccess }: { article: Article, onSuccess: () => void }) {
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
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer cet article ?
                    </DialogDescription>
                </DialogHeader>

                <Button
                    className="w-full"
                    variant="destructive"
                    onClick={async () => {
                        const result = await deleteArticle(article.id);
                        if (result) {
                            setOpen(false);
                            onSuccess();
                            toast.success("Article supprimé avec succès !")
                        }
                    }}
                >
                    Supprimer
                </Button>
            </DialogContent>
        </Dialog>
    );
}