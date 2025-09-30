import { useEffect, useState } from "react";
import { authClient } from "./authClient";
import { useAuthStore } from "./authStore";

export function useSession() {
    const setUser = useAuthStore((s) => s.setUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        let cancelled = false;

        authClient.getSession()
            .then((res) => {
                if (!cancelled) {
                    const user = res?.data?.user ?? null;
                    setUser(user);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setUser(null);
                    setError("Session invalide ou expirée");
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { loading, error };
}
