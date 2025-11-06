import { useEffect, useState, useCallback } from "react";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

export function useTarifsLivraisons() {
    const [tarifsLivraisons, setTarifsLivraisons] = useState<any[]>([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [loadingTarifsLivraisons, setLoading] = useState(false);
    const [errorTarifsLivraisons, setError] = useState<string | null>(null);

    const refreshTarifsLivraisons = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${getBaseUrl()}/api/admin/shippings-rates`, {
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) {
                const msg = await res.text();
                setError(msg);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setTarifsLivraisons(data);
            setHasFetched(true);
        } catch (err: any) {
            setError(err.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched) {
            refreshTarifsLivraisons();
        }
    }, [hasFetched, refreshTarifsLivraisons]);

    return {
        tarifsLivraisons,
        loadingTarifsLivraisons,
        errorTarifsLivraisons,
        refreshTarifsLivraisons,
    };
}
