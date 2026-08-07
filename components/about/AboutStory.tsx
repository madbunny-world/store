"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SplatinkHeading from "@/components/SplatinkHeading";

// Founding-story carousel (dark reference design). One sticky full-viewport
// stage sits inside a 400vh scroll track; vertical scroll drives a horizontal
// strip of circular images. The active circle sits centered, full-size and
// bright; scrolling down slides the next circle in from the right while the
// previous one is pushed off to the left (reversed scrolling up). Mandatory
// snap + hidden scrollbar come from html.about-fullpage (globals.css), which
// also flips the whole route to the dark theme.

import { CHAPTERS } from "./chapters";

const LAST = CHAPTERS.length - 1;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function AboutStory() {
  const trackRef = useRef<HTMLElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const hintRef = useRef<HTMLButtonElement>(null);
  const joinRef = useRef<HTMLAnchorElement>(null);

  // Dark full-page mode — mandatory snap, hidden scrollbar, dark nav/footer.
  // sm+ only: on mobile the route renders AboutSimple (light one-pager), so
  // the dark theme must not take over there.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => {
      document.documentElement.classList.toggle("about-fullpage", mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.classList.remove("about-fullpage");
    };
  }, []);

  // Scroll-driven carousel.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // Progress through the story: 0 (first chapter) … LAST (last chapter).
      const p = clamp(-track.getBoundingClientRect().top / vh, 0, LAST);

      const d = Math.min(vh * 0.56, vw * 0.8) * 0.78; // circle diameter (0.6 × 1.3)
      const spacing = vw / 2 + d * 0.35; // neighbors peek in at the edges

      circleRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = i - p; // 0 = centered, ±1 = one screen away
        const away = Math.min(Math.abs(o), 1);
        el.style.width = `${d}px`;
        if (reduced) {
          // No motion: just show the active circle.
          el.style.transform = "translate(-50%, -50%)";
          el.style.filter = "none";
          el.style.visibility = Math.round(p) === i ? "visible" : "hidden";
          return;
        }
        el.style.transform = `translate(calc(-50% + ${(o * spacing).toFixed(1)}px), -50%) scale(${(1 - 0.2 * away).toFixed(3)})`;
        el.style.filter = `brightness(${(1 - 0.55 * away).toFixed(3)})`;
        el.style.visibility = Math.abs(o) > 1.6 ? "hidden" : "visible";
      });

      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const away = Math.abs(i - p);
        el.style.opacity = reduced
          ? Math.round(p) === i
            ? "1"
            : "0"
          : String(clamp(1 - away * 1.8, 0, 1).toFixed(3));
      });

      // [ SCROLL DOWN ] on all but the last chapter; JOIN MADCLUB fades in last.
      if (hintRef.current) {
        const o = clamp(LAST - 0.4 - p, 0, 1);
        hintRef.current.style.opacity = String(o);
        hintRef.current.style.pointerEvents = o > 0.3 ? "auto" : "none";
      }
      if (joinRef.current) {
        const o = clamp((p - (LAST - 0.8)) / 0.8, 0, 1);
        joinRef.current.style.opacity = String(o);
        joinRef.current.style.pointerEvents = o > 0.6 ? "auto" : "none";
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Wheel-flip: a deliberate wheel/trackpad gesture animates straight to the
  // next/previous screen center instead of free-scrolling — minimizing the
  // in-between state. Touch keeps native snap; at the story's edges the event
  // passes through so the footer (below) and page top stay reachable.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let animating = false;
    let acc = 0;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      // Active while the story covers the viewport center (the nav offsets the
      // track by ~68px at the very top — don't let that gap leak gestures).
      if (rect.top > vh * 0.5 || rect.bottom < vh * 0.5) return;
      const p = clamp(-rect.top / vh, 0, LAST);
      const dir = e.deltaY > 0 ? 1 : -1;

      // Nothing beyond the ends (the footer is hidden on this route) — swallow
      // edge gestures so the story doesn't bounce against the scroll bounds.
      if ((p >= LAST - 0.01 && dir > 0) || (p <= 0.01 && dir < 0)) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      if (animating) return;
      acc += e.deltaY;
      if (Math.abs(acc) < 40) return;

      const target = clamp(Math.round(p) + dir, 0, LAST);
      acc = 0;
      animating = true;
      const top = window.scrollY + rect.top + target * vh;
      window.scrollTo({ top, behavior: "smooth" });
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        animating = false;
        acc = 0;
      }, 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, []);

  // Horizontal swipe (touch) — swipe left flips to the next screen, swipe
  // right to the previous, mirroring the wheel-flip. Vertical swipes keep the
  // native snap scroll untouched.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let animating = false;
    let startX = 0;
    let startY = 0;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top > vh * 0.5 || rect.bottom < vh * 0.5) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      // Deliberate horizontal swipes only.
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if (animating) return;
      const p = clamp(-rect.top / vh, 0, LAST);
      const dir = dx < 0 ? 1 : -1; // swipe left → forward
      const target = clamp(Math.round(p) + dir, 0, LAST);
      if (target === Math.round(p)) return;
      animating = true;
      window.scrollTo({
        top: window.scrollY + rect.top + target * vh,
        behavior: "smooth",
      });
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        animating = false;
      }, 700);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, []);

  // Nav "About" while already here → restart the story from the first screen.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href="/about"]');
      if (link) window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <section ref={trackRef} className="relative h-[400vh]">
      {/* Snap markers — one per chapter, invisible; the document snaps to these. */}
      {CHAPTERS.map((_, i) => (
        <div
          key={i}
          id={`chapter-${i + 1}`}
          aria-hidden
          className="absolute left-0 h-screen w-full snap-center"
          style={{ top: `${i * 100}vh` }}
        />
      ))}

      {/* The stage — sticks for the whole story. */}
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden">
        <div className="flex flex-col items-center gap-3 pt-24 text-bunny-white">
          <SplatinkHeading name="about" className="h-10 sm:h-11" />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em]">
            The Founding Story
          </p>
        </div>

        {/* Circle strip */}
        <div className="relative w-full flex-1">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.src}
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 aspect-square overflow-hidden rounded-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.src}
                alt={c.alt}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Copy — one per chapter, cross-faded. */}
        <div className="relative h-40 w-full max-w-2xl px-4">
          {CHAPTERS.map((c, i) => (
            <p
              key={c.src}
              ref={(el) => {
                copyRefs.current[i] = el;
              }}
              className="absolute inset-x-4 top-0 text-center text-[15px] leading-relaxed text-bunny-white/80 [&_strong]:font-semibold [&_strong]:text-bunny-white"
            >
              {c.copy}
            </p>
          ))}
        </div>

        {/* Footer slot: scroll hint ↔ join button. */}
        <div className="relative mb-14 h-14 w-full">
          <button
            ref={hintRef}
            onClick={() =>
              window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
            }
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] uppercase tracking-[0.25em] text-mad-red transition-opacity hover:opacity-70 max-sm:hidden"
          >
            [ Scroll down ]
          </button>
          <Link
            ref={joinRef}
            href="/jointheclub"
            style={{ opacity: 0, pointerEvents: "none" }}
            className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-[calc(50%+20px)] items-center gap-6 rounded-md border border-mad-red/70 bg-black px-[29px] py-[13px] font-mono text-[13px] uppercase tracking-wider text-mad-red shadow-[0_0_25px_rgba(255,64,43,0.35)] transition-shadow hover:shadow-[0_0_40px_rgba(255,64,43,0.6)]"
          >
            Join Madclub
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
