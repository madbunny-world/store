"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCart } from "./cart/CartProvider";

const links = [
  { href: "/collectibles", label: "Collectibles" },
  { href: "/apparel", label: "Apparel" },
  { href: "/about", label: "About" },
  { href: "/jointheclub", label: "Join the club" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { cart, open: openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="-m-3 p-3 hover:opacity-60"
      >
        {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
      </button>

      {open && (
        <div className="mobile-menu-panel absolute inset-x-0 top-full bg-white px-4 pb-6 pt-2 font-mono text-xs uppercase tracking-wider">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:opacity-60">
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openCart();
              }}
              className="text-left hover:opacity-60"
            >
              Cart{count > 0 ? ` (${count})` : ""}
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
