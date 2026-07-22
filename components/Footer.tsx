"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  // The mobile landing is a full-bleed gate: the city clocks anchor the bottom,
  // so the footer would crowd them. Hide it there; keep it on desktop home and
  // on every other route.
  const isHome = usePathname() === "/";

  return (
    <footer
      className={`px-4 py-6 text-center text-xs text-gun-metal${
        isHome ? " hidden sm:block" : ""
      }`}
    >
      © 2026 Madbunny. All rights reserved.
    </footer>
  );
}
