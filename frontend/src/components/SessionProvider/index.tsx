"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/authClient";
import type { User } from "better-auth";

const SessionContext = createContext<{
    user: User | null;
    loadingUser: boolean;
    refreshSession: () => Promise<void>;
}>({
    user: null,
    loadingUser: true,
    refreshSession: async () => { }
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const refreshSession = async () => {
        setLoadingUser(true);
        try {
            const session = await authClient.getSession();
            setUser(session?.data?.user ?? null);
        } catch {
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <SessionContext.Provider value={{ user, loadingUser, refreshSession  }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    return useContext(SessionContext);
}
