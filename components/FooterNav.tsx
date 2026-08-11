"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

export type FooterGroup = {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
};

const LINK_CLASS =
  "font-sans text-[10px] uppercase tracking-wide text-bunny-white transition-opacity hover:opacity-60";

function LinkItem({ link }: { link: FooterGroup["links"][number] }) {
  return link.external ? (
    <a
      href={link.href}
      className={LINK_CLASS}
      {...(link.href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={LINK_CLASS}>
      {link.label}
    </Link>
  );
}

// Footer sitemap, two shapes (Gia, 2026-08): md+ lays the five groups out as
// one horizontal row of columns — a single ~110px band, so the footer stays
// short and the newsletter above it stays in the footer peek. Below md the
// groups collapse into an accordion (one open at a time, first open) to save
// vertical space on small screens. The caller clears the brand mark on the
// right via padding on this nav.
export default function FooterNav({
  groups,
  className = "",
}: {
  groups: FooterGroup[];
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(groups[0]?.heading ?? null);

  return (
    <nav aria-label="Footer" className={className}>
      {/* md and up: columns in one row */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-x-6">
        {groups.map((group) => (
          <div key={group.heading}>
            <h2 className="font-sans text-[10px] uppercase tracking-wide text-white/45">
              {group.heading}
            </h2>
            <ul className="mt-[11px] flex flex-col gap-[5px]">
              {group.links.map((link) => (
                <li key={link.label} className="leading-snug">
                  <LinkItem link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* below md: accordion */}
      <div className="md:hidden">
        {groups.map((group) => {
          const isOpen = open === group.heading;
          return (
            <div key={group.heading} className="border-b border-white/15 first:border-t">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : group.heading)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between py-4 font-sans text-[11px] uppercase tracking-wide text-bunny-white"
              >
                {group.heading}
                {isOpen ? (
                  <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
                ) : (
                  <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                )}
              </button>
              {isOpen && (
                <ul className="flex flex-col gap-[6px] pb-[14px]">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <LinkItem link={link} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
