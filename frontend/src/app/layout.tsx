import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "react-hot-toast";
import { CookieBanner } from "@/components/CookiesBanner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
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
          <ClientLayout>
            <Toaster position="top-right" />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Analytics />
            <SpeedInsights />
          </ClientLayout>
        </SessionProvider>

        <Footer />
      </body>
    </html>
  );
}
