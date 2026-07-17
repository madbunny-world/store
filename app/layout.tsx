import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import FloatingCart from "@/components/cart/FloatingCart";

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
  metadataBase: new URL("https://madbunny.com"),
  title: {
    default: "Madbunny",
    template: "%s — Madbunny",
  },
  description: "Madbunny. A character-IP lifestyle brand. Limited drops.",
  openGraph: {
    siteName: "Madbunny",
    type: "website",
  },
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
      </body>
    </html>
  );
}
