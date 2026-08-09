"use client";

import { useEffect, useRef } from "react";

// Home entrance: plate twist on white, then the overlay fades into the (white)
// store. Plays on EVERY arrival at the home page in two cuts: hard loads run
// the full ~2s title card (armed pre-paint as data-intro="play" by the inline
// script in app/page.tsx, so the page never flashes first); client-side
// navigations run a ~1s cut (armed here on mount as data-intro="quick" — CSS
// shortens the twist to 0.7s) so mid-shopping returns stay light. Without JS
// the attribute is never set and under prefers-reduced-motion CSS keeps the
// overlay hidden regardless. The overlay hides by attribute removal, never by
// detaching React-managed DOM.
export default function IntroGate() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // CSS already suppresses the overlay under reduced motion; skip the timers
    // and attribute churn too.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The inline script arming pre-paint means hard load; otherwise this is a
    // client-side navigation and gets the quick cut.
    const hard =
      document.documentElement.getAttribute("data-intro") === "play";
    if (!hard) document.documentElement.setAttribute("data-intro", "quick");
    el.style.opacity = "1";
    el.style.pointerEvents = "";
    el.style.transitionDuration = hard ? "400ms" : "300ms";

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
      window.setTimeout(finish, 700); // fallback if transitionend never fires
    };

    // Full cut: 1.5s twist + 0.4s fade ≈ 2s. Quick cut: 0.7s + 0.3s ≈ 1s.
    const fadeTimer = window.setTimeout(fade, hard ? 1600 : 700);
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
