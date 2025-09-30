"use client";

import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user]);

    if (!user) return null;

    return <>{children}</>;
}
