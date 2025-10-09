import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { CategoryHydrator } from "@/components/CategoryHydrator/CategoryHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sacs à Bonheur",
  description: "Boutique de sacs, fait à la main en France",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <CategoryHydrator />
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProvider>

        <Footer />
      </body>
    </html>
  );
}
