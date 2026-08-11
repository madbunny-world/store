"use client";

import { useEffect, useRef } from "react";

// Home entrance: plate twist on white, then the overlay fades into the (white)
// store. Plays on EVERY arrival at the home page. Hard loads are armed pre-paint
// as data-intro="play" by the inline script in app/page.tsx so the page never
// flashes first; client-side navigations arm here on mount as "quick". Both run
// the same 1s cut (Gia, 2026-08 — the hard load used to run ~2s), so the two
// attribute values now differ only in WHERE they are set. Without JS the
// attribute is never set, and under prefers-reduced-motion CSS keeps the overlay
// hidden regardless. The overlay hides by attribute removal, never by detaching
// React-managed DOM.

// 0.7s twist + 0.3s fade = 1s. TWIST_MS must match the intro-twist animation
// duration in globals.css.
const TWIST_MS = 700;
const FADE_MS = 300;

export default function IntroGate() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // CSS already suppresses the overlay under reduced motion; skip the timers
    // and attribute churn too.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Armed pre-paint by the inline script on a hard load; otherwise this is a
    // client-side navigation and has to arm itself.
    if (document.documentElement.getAttribute("data-intro") !== "play") {
      document.documentElement.setAttribute("data-intro", "quick");
    }
    el.style.opacity = "1";
    el.style.pointerEvents = "";
    el.style.transitionDuration = `${FADE_MS}ms`;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      document.documentElement.removeAttribute("data-intro");
    };
    const fade = () => {
      el.style.pointerEvents = "none";
      el.style.opacity = "0";
      el.addEventListener("transitionend", finish, { once: true });
      // Fallback if transitionend never fires (backgrounded tab, etc).
      window.setTimeout(finish, FADE_MS + 400);
    };

    const fadeTimer = window.setTimeout(fade, TWIST_MS);
    const skip = () => {
      window.clearTimeout(fadeTimer);
      fade();
    };
    el.addEventListener("click", skip);

    return () => {
      window.clearTimeout(fadeTimer);
      el.removeEventListener("click", skip);
      // Navigating away mid-play: drop the overlay immediately.
      document.documentElement.removeAttribute("data-intro");
    };
  }, []);

  return (
    <div
      id="intro-gate"
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[100] items-center justify-center bg-white transition-opacity"
    >
      <picture className="intro-plate block w-[min(60vw,420px)]">
        <source srcSet="/media/bunny-metal.webp 1x, /media/bunny-metal@2x.webp 2x" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/bunny-metal.webp"
          alt=""
          width={880}
          height={880}
          className="h-auto w-full"
          loading="eager"
        />
      </picture>
    </div>
  );
}
