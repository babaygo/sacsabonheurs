"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/authClient";
import type { User } from "better-auth";

const SessionContext = createContext<{
    user: User | null;
    loadingUser: boolean;
}>({ user: null, loadingUser: true });

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        authClient.getSession()
            .then((session) => setUser(session?.data?.user ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoadingUser(false));
    }, []);

    return (
        <SessionContext.Provider value={{ user, loadingUser }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    return useContext(SessionContext);
}
