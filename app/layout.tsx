import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartUpsells from "@/components/cart/CartUpsells";
import FloatingInstagram from "@/components/FloatingInstagram";
import { siteUrl } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

// Geist Mono: nav, labels, captions, timestamps. OFL, free, self-hosted by next/font.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Bebas Neue (SIL OFL): home-page location / clock / enter texts. Self-hosted.
const bebasNeue = localFont({
  src: "./fonts/BebasNeue-Regular.ttf",
  variable: "--font-bebas-neue",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Madbunny — Limited drops",
    template: "%s — Madbunny",
  },
  description:
    "Madbunny. A character-IP drop brand — collectible figures, apparel, and fine art. Available in limited numbers.",
  // No canonical here on purpose: metadata is inherited, so a root canonical
  // would make every route that doesn't set its own — notably not-found.tsx and
  // any missing slug — claim to be the homepage. Each real route declares its
  // own; a 404 correctly declares none.
  openGraph: {
    siteName: "Madbunny",
    type: "website",
    // Shorter and plainer than the SEO description above. A share card is read
    // in a chat thread, where iMessage/KakaoTalk clip after ~2 lines — the
    // search-result sentence was being cut mid-phrase (Gia, 2026-08).
    description:
      "MADBUNNY OFFICIAL STORE. Madbunny is an iconic lifestyle brand symbolizing “crazy people who change the world”",
    // Purpose-made 1200×630 card (Gia, 2026-08) — the exact ratio every
    // platform crops to, so it renders as drawn. Also the fallback for any
    // page that doesn't set its own image.
    images: [
      {
        url: "/media/social-card.jpg",
        width: 1200,
        height: 630,
        alt: "Madbunny",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the home intro's pre-paint script sets
    // data-intro on <html> before hydration (theme-switcher pattern) — scoped
    // to this element's own attributes only.
    <html
      lang="en"
      className={`${geistMono.variable} ${bebasNeue.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {/* Above (not inside) the sticky header: the strip scrolls away, the
              nav then sticks at the viewport top. */}
          <AnnouncementBar />
          <Nav />
          {children}
          <Footer />
          <FloatingInstagram />
          <CartUpsells />
        </CartProvider>
        {/* Site-wide Organization + WebSite schema, once per page. */}
        <JsonLd data={organizationJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
