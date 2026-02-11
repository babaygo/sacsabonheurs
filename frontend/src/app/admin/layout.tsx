"use client";

import { useSessionContext } from "@/components/shared/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loadingUser } = useSessionContext();
    const router = useRouter();

    useEffect(() => {
        if (!loadingUser && user?.role !== "admin") {
            router.push("/");
        }
    }, [user, loadingUser, router]);

    if (loadingUser) return null;

    if (user?.role !== "admin") return null;

    return <>{children}</>;
}
