"use client";

// Same-page anchor that scrolls every time it is clicked. A plain <a href="#id">
// is a no-op once the URL already carries that hash — click it, scroll back up,
// click again and nothing happens. This intercepts the click and scrolls
// directly. scrollIntoView() with no options uses behavior:"auto", which
// resolves to the CSS scroll-behavior — already reduced-motion guarded in
// globals.css — and honours the target's scroll-margin. Without JS the href
// still works.
export default function HashLink({
  href,
  className,
  tabIndex,
  children,
}: {
  href: string;
  className?: string;
  tabIndex?: number;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      tabIndex={tabIndex}
      onClick={(e) => {
        const el = document.getElementById(href.slice(1));
        if (!el) return; // unknown target — let the browser try
        e.preventDefault();
        el.scrollIntoView();
        // Keep the URL in sync without stacking no-op history entries.
        history.replaceState(null, "", href);
      }}
    >
      {children}
    </a>
  );
}
