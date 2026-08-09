import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import FloatingInstagram from "@/components/FloatingInstagram";
import { siteUrl } from "@/lib/site";

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
  openGraph: {
    siteName: "Madbunny",
    type: "website",
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
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
