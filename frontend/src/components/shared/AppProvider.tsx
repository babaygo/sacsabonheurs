"use client";

import { useEffect } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if ((e.target as HTMLElement).tagName === "IMG") {
                e.preventDefault();
            }
        };
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    return <>{children}</>;
}