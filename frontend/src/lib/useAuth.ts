import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
    fetchOptions: { credentials: "include" },
});

export function useAuth() {
    const setUser = useAuthStore((s) => s.setUser);

    useEffect(() => {
        let cancelled = false;

        authClient.getSession()
            .then((res) => {
                if (!cancelled) {
                    const user = res?.data?.user ?? null;
                    setUser(user);
                }
            })
            .catch(() => {
                if (!cancelled) setUser(null);
            });

        return () => {
            cancelled = true;
        };
    }, []);
}
