import type { Metadata } from "next";
import { Montserrat, Fraunces } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CookiesBanner } from "@/components/shared/CookiesBanner";
import Footer from "@/components/features/layout/Footer";
import { ProductsProvider } from "@/contexts/ProductsContext";
import DynamicBanner from "@/components/features/layout/DynamicBanner";
import { AppProvider } from "@/components/shared/AppProvider";
import Header from "@/components/features/layout/Header";
import { SITE_URL, BRAND_NAME } from "@/lib/seo/seo";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sacs à Bonheurs",
  description:
    "Sacs faits main en France, alliant savoir-faire, passion et qualité. Découvrez une boutique artisanale dédiée à l'élégance durable.",
  // Open Graph defaults — pages override title/url/images/type per page via generateMetadata.
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Sacs à Bonheurs – Élégance artisanale",
    description:
      "Sacs faits main en France, alliant savoir-faire, passion et qualité. Découvrez une boutique artisanale dédiée à l'élégance durable.",
    images: [{ url: "/assets/og_image.jpg", width: 1200, height: 628, alt: BRAND_NAME }],
    siteName: BRAND_NAME,
    locale: "fr_FR",
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${fraunces.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": `${process.env.NEXT_PUBLIC_URL_FRONT}`,
            "logo": `${process.env.NEXT_PUBLIC_URL_FRONT}/assets/sacs-a-bonheurs-logo.png`,
            "name": "Sacs à Bonheurs",
            "sameAs": [
              "https://www.instagram.com/sacs_a_bonheurs/",
              "https://www.facebook.com/p/Sacs-%C3%A0-bonheurs-61555061294316/"
            ]
          })
        }} />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      </head>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <DynamicBanner />
        <AppProvider>
          <SessionProvider>
            <ProductsProvider>
              <Header />
              <Toaster position="top-right" />
              <main className="max-w-7xl mx-auto px-4 mt-3 sm:px-6 lg:px-8">
                {children}
              </main>
              <CookiesBanner />
              <Analytics />
              <SpeedInsights />
            </ProductsProvider>
          </SessionProvider>
        </AppProvider>
        <Footer />
      </body>
    </html>
  );
}
