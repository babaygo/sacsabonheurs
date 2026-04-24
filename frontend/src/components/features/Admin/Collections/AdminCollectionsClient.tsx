"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { Collection } from "@/types/Collection";
import { getCollections, createCollection, updateCollection, setCollectionProducts } from "@/lib/api/collection";
import { getProducts } from "@/lib/api/product";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Plus, Star } from "lucide-react";
import { CollectionDialog } from "@/components/shared/Dialogs/CollectionDialog";
import { DeleteCollectionDialog } from "@/components/shared/Dialogs/CollectionDeleteDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AdminCollectionsClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [allProducts, setAllProducts] = useState<{ id: number; name: string; hidden: boolean; collectionId?: number | null }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    useEffect(() => {
        if (!loadingUser && user?.role !== "admin") {
            router.push("/");
        }
    }, [user, loadingUser, router]);

    useEffect(() => {
        loadCollections();
        getProducts().then(setAllProducts);
    }, []);

    const loadCollections = async () => {
        try {
            setLoading(true);
            const data = await getCollections();
            setCollections(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des collections");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (collection?: Collection) => {
        setEditingCollection(collection || null);
        setOpenDialog(true);
    };

    const handleSaveCollection = async (data: FormData, productIds: number[]) => {
        let saved;
        if (editingCollection) {
            saved = await updateCollection(editingCollection.id, data, editingCollection.slug);
        } else {
            saved = await createCollection(data);
        }
        await setCollectionProducts(saved.id, productIds);
        await loadCollections();
        getProducts().then(setAllProducts);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-4">
            <div className="flex items-center justify-between mb-6">
                <h1>Collections</h1>
                <Button variant="outline" onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter une collection
                </Button>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {collections.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Aucune collection trouvée</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Matière</TableHead>
                            <TableHead>Ordre</TableHead>
                            <TableHead>En avant</TableHead>
                            <TableHead>Créé</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.map((collection) => (
                            <TableRow key={collection.id}>
                                <TableCell className="font-medium">{collection.title}</TableCell>
                                <TableCell className="text-muted-foreground">{collection.slug}</TableCell>
                                <TableCell>{collection.material}</TableCell>
                                <TableCell>{collection.order}</TableCell>
                                <TableCell>
                                    {collection.featured && (
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {new Date(collection.createdAt).toLocaleDateString("fr-FR")}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenDialog(collection)}
                                    >
                                        Modifier
                                    </Button>
                                    <DeleteCollectionDialog
                                        collection={collection}
                                        onSuccess={loadCollections}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <CollectionDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                collection={editingCollection}
                allProducts={allProducts}
                onSave={handleSaveCollection}
            />
        </div>
    );
}
