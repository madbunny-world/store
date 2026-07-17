import Link from "next/link";
import BunnyMark from "./BunnyMark";
import MobileMenu from "./MobileMenu";

// Inline glyph — lucide-react 1.x dropped brand icons.
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const INSTAGRAM_URL = "https://www.instagram.com/madbunny.world/";

const linkClass = "transition-opacity hover:opacity-60";

// Mock layout: one centered group — COLLECTIBLES APPAREL [mark] ABOUT JOIN THE
// CLUB — with the Instagram icon pinned to the far right. Cart lives in the
// floating bubble (FloatingCart), not the bar.
export default function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm">
      {/* md and up */}
      <nav className="relative hidden items-center justify-center gap-8 px-6 py-5 font-bebas text-lg uppercase tracking-wide md:flex">
        <Link href="/collectibles" className={linkClass}>
          Collectibles
        </Link>
        <Link href="/apparel" className={linkClass}>
          Apparel
        </Link>
        <Link href="/" aria-label="Madbunny home" className={linkClass}>
          <BunnyMark className="h-6 w-6" />
        </Link>
        <Link href="/about" className={linkClass}>
          About
        </Link>
        <Link href="/jointheclub" className={linkClass}>
          Join the club
        </Link>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={`${linkClass} absolute right-6`}
        >
          <InstagramGlyph className="h-5 w-5" />
        </a>
      </nav>

      {/* below md: mark + menu toggle */}
      <nav className="flex items-center justify-between px-4 py-4 md:hidden">
        <Link href="/" aria-label="Madbunny home" className={linkClass}>
          <BunnyMark className="h-6 w-6" />
        </Link>
        <MobileMenu />
      </nav>
    </header>
  );
}
