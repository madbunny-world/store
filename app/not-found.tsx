import Link from "next/link";
import BunnyMark from "@/components/BunnyMark";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-3 py-24 text-center md:px-12">
      <BunnyMark className="h-12 w-12 text-black" />
      <p className="font-mono text-sm uppercase tracking-[0.25em] text-gun-metal">
        404 — Not found
      </p>
      {/* Sold-out pieces keep their pages (they render a Sold out state), so a
          404 here means a wrong address, never a sold-out product. */}
      <p className="max-w-sm text-[15px] leading-relaxed text-gun-metal">
        This page does not exist. Check the address, or browse the collection.
      </p>
      <Link
        href="/"
        className="mt-2 bg-black px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-bunny-white transition-opacity hover:opacity-80"
      >
        Back home
      </Link>
    </main>
  );
}
