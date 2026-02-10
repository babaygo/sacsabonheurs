"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { BannerDialog } from "@/components/shared/Dialogs/BannerDialog";
import { Banner } from "@/types/Banner";
import toast from "react-hot-toast";
import { DeleteBannerDialog } from "@/components/shared/Dialogs/BannerDeleteDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAdminBanners } from "@/lib/api/banner";


export default function AdminBannersClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const fetchBanners = async () => {
        try {
            const data = await getAdminBanners();
            setBanners(data);
        } catch (err: any) {
            toast.error(err.message || "Erreur serveur");
        }
    };

    useEffect(() => {
        if (!loadingUser) {
            if (user?.role !== "admin") {
                router.push("/");
            } else {
                fetchBanners();
            }
        }
    }, [user, loadingUser]);

    const handleAdd = () => {
        setSelectedBanner(null);
        setOpenDialog(true);
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setOpenDialog(true);
    };

    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <div className="flex justify-between">
                    <h1 className="text-3xl sm:text-4xl font-bold">Bannières</h1>
                    <Button variant="outline" onClick={handleAdd}>
                        <Plus />
                        Ajouter une bannière
                    </Button>
                </div>

                <BannerDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    banner={selectedBanner}
                    onSave={async () => {
                        
                        await fetchBanners();
                    }}
                />

                {banners.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Message</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Lien</TableHead>
                                <TableHead>Active (une seule bannière peut être active)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {banners.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell className="max-w-md truncate">{banner.message}</TableCell>
                                    <TableCell>{banner.variant}</TableCell>
                                    <TableCell>
                                        <span className="inline-block max-w-[200px] truncate" title={banner.ctaHref ? banner.ctaHref : ""}>
                                            {banner.ctaLabel ? `${banner.ctaLabel} → ${banner.ctaHref}` : "—"}
                                        </span>
                                    </TableCell>
                                    <TableCell>{banner.active ? "Oui" : "Non"}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleEdit(banner)}
                                        >
                                            Modifier
                                        </Button>
                                        <DeleteBannerDialog banner={banner} onSuccess={fetchBanners} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>Aucune bannière disponible.</p>
                )}
            </div>
        </div>
    );
}
