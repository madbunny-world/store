import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import FloatingCart from "@/components/cart/FloatingCart";
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
    <html lang="en" className={`${geistMono.variable} ${bebasNeue.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Nav />
          {children}
          <Footer />
          <FloatingCart />
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
