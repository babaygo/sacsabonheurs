"use client";

import Header from "@/components/Header";
import { useAuth } from "@/lib/useAuth";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useAuth();
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/login") && !pathname.startsWith("/signup");

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
