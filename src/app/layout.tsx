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
    default: "Himalayan salt and Basmati rice exporters | Drake Passage",
    template: "%s | Drake Passage",
  },
  description:
    "Drake Passage Pvt Limited, Lahore: Himalayan salt and Basmati rice exporters, with fresh produce and spices on enquiry. FOB or CIF quotes, samples by courier.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Drake Passage", locale: "en_GB" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-navy focus:text-salt focus:px-3 focus:py-2 focus:rounded-control"
        >
          Skip to content
        </a>
        <Header categories={getCategories()} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
