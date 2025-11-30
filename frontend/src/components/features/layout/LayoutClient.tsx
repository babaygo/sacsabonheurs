"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/choose-relay");

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
