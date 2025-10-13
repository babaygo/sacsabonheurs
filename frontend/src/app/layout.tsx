import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { CategoryHydrator } from "@/components/CategoryHydrator/CategoryHydrator";
import { Toaster } from "react-hot-toast";

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
        className={`${montserrat.variable} ${playfairDisplay.variable} `}
      >
        <SessionProvider>
          <CategoryHydrator />
          <ClientLayout>
            <Toaster position="top-right" />
            <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
              {children}
            </div>
          </ClientLayout>
        </SessionProvider>

        <Footer />
      </body>
    </html>
  );
}
