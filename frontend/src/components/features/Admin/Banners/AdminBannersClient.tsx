"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AddBannerDialog } from "@/components/shared/Dialogs/BannerAddDialog";
import { EditBannerDialog } from "@/components/shared/Dialogs/BannerEditDialog";
import { Banner } from "@/types/Banner";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";
import toast from "react-hot-toast";
import { DeleteBannerDialog } from "@/components/shared/Dialogs/BannerDeleteDialog";


export default function AdminBannersClient() {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/banners`, { credentials: 'include' });
            if (!res.ok) throw new Error("Erreur récupération banners");
            const data = await res.json();
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

    return (
        <div className="min-h-screen pt-4">
            <div className="space-y-8">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Bannières</h1>
                    <AddBannerDialog onSuccess={fetchBanners} />
                </div>

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
                                        <EditBannerDialog banner={banner} onSuccess={fetchBanners} />
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
