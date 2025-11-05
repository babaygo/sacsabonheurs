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
import { ProductsProvider } from "@/contexts/ProductsContext";
import DynamicBanner from "@/components/features/layout/DynamicBanner";

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
  description:
    "Sacs faits main en France, alliant savoir-faire, passion et qualité. Découvrez une boutique artisanale dédiée à l'élégance durable."
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_URL_FRONT} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": `${process.env.NEXT_PUBLIC_URL_FRONT}`,
            "logo": `${process.env.NEXT_PUBLIC_URL_FRONT}/sacs-a-bonheurs-logo.png`,
            "name": "Sacs à Bonheurs"
          })
        }} />
        {/* Balises Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL_FRONT} />
        <meta property="og:title" content="Sacs à Bonheurs – Élégance artisanale" />
        <meta property="og:description" content="Sacs faits main en France, alliant savoir-faire, passion et qualité. Découvrez une boutique artisanale dédiée à l'élégance durable." />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL_FRONT}/og_image.png`} />
        <meta property="og:site_name" content="Sacs à Bonheurs" />
        <meta property="og:locale" content="fr_FR" />

      </head>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <DynamicBanner />
        <SessionProvider>
          <ProductsProvider>
            <LayoutClient>
              <Toaster position="top-right" />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </main>
              <CookiesBanner />
              <Analytics />
              <SpeedInsights />
            </LayoutClient>
          </ProductsProvider>
        </SessionProvider>

        <Footer />
      </body>
    </html>
  );
}
