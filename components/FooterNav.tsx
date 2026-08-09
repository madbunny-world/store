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

// Footer sitemap (reference: Two Jeys). md+ renders the five columns; below md
// each group is a full-width accordion row (+ / − toggles, hairline rules) so
// the footer stays short. One group open at a time; the first starts open,
// matching the reference.
export default function FooterNav({ groups }: { groups: FooterGroup[] }) {
  const [open, setOpen] = useState<string | null>(groups[0]?.heading ?? null);

  return (
    <nav aria-label="Footer">
      {/* md and up: columns */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-x-8">
        {groups.map((group) => (
          <div key={group.heading}>
            <h2 className="font-sans text-[10px] uppercase tracking-wide text-white/45">
              {group.heading}
            </h2>
            <ul className="mt-[11px] flex flex-col gap-[5px]">
              {group.links.map((link) => (
                <li key={link.label}>
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
