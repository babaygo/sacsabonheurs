import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CookiesBanner } from "@/components/shared/CookiesBanner";
import LayoutClient from "@/components/features/layout/LayoutClient";
import Footer from "@/components/features/layout/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  preload: false,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Sacs à Bonheurs",
  description: "Sacs faits main en France, alliant savoir-faire, passion et qualité. Découvrez une boutique artisanale dédiée à l'élégance durable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfairDisplay.variable} `}>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <SessionProvider>
          <LayoutClient>
            <Toaster position="top-right" />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <CookiesBanner />
            <Analytics />
            <SpeedInsights />
          </LayoutClient>
        </SessionProvider>

        <Footer />
      </body>
    </html>
  );
}
