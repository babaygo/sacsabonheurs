"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/login") && !pathname.startsWith("/signup") && !pathname.startsWith("/choose-relay") && !pathname.startsWith("/reset-password");

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
