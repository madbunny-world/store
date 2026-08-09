const INSTAGRAM_URL = "https://www.instagram.com/madbunny.world/";

// A circular gray bubble pinned to the lower-right corner — the slot the cart
// bubble used to hold. Shown on every page.
export default function FloatingInstagram() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="fixed bottom-6 right-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-card text-gun-metal transition-opacity hover:opacity-70"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}
