"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// Mirrors the desktop nav: the three categories sit under Shop. There is no
// hover on touch, so they are always shown, indented, rather than in a panel.
const links: { href: string; label: string; children?: { href: string; label: string }[] }[] = [
  {
    href: "/",
    label: "Shop",
    children: [
      { href: "/toyfigures", label: "Toy figures" },
      { href: "/private-collection", label: "Private Collection" },
      { href: "/clothing", label: "Clothing" },
    ],
  },
  { href: "/about", label: "About" },
  { href: "/collectorslounge", label: "Collector’s lounge" },
];

// accountUrl: Shopify's hosted sign-in — "My order" links straight there, no
// interstitial page, so it renders as a plain <a> below.
export default function MobileMenu({ accountUrl }: { accountUrl: string }) {
  const [open, setOpen] = useState(false);

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
        <div className="mobile-menu-panel absolute inset-x-0 top-full bg-white px-3 pb-6 pt-2 font-sans text-[11.7px] font-medium uppercase tracking-wide">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <div key={l.href} className="flex flex-col gap-4">
                <Link href={l.href} onClick={() => setOpen(false)} className="hover:opacity-60">
                  {l.label}
                </Link>
                {l.children?.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setOpen(false)}
                    className="pl-4 text-gun-metal hover:opacity-60"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
            <a href={accountUrl} onClick={() => setOpen(false)} className="hover:opacity-60">
              My order
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
