import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppBubble } from "@/components/layout/WhatsAppBubble";
import { getCategories } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drake Passage — Salt, rice and fresh produce exporters, Pakistan",
    template: "%s | Drake Passage",
  },
  description:
    "Drake Passage Pvt Limited exports Himalayan salt, basmati and non-basmati rice, potatoes, onions, tomatoes and spices from Pakistan. FOB and CIF quotes, samples by DHL or Leopard.",
  alternates: { canonical: "/" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Drake Passage Pvt Limited",
  url: SITE_URL,
  telephone: "+923047409567",
  email: "mansoorshahid47@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Kasur", addressRegion: "Punjab", addressCountry: "PK" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-navy focus:text-salt focus:px-3 focus:py-2 focus:rounded-control"
        >
          Skip to content
        </a>
        <Header categories={getCategories()} />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
