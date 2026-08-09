// Thin black announcement strip above the header: the two messages repeat and
// flow right-to-left in a seamless CSS marquee (two identical halves, track
// translates -50% and loops). The moving copy is aria-hidden — screen readers
// get each sentence once from the sr-only block — and reduced motion stops the
// track via the .marquee-track rule in globals.css. Sits above (not inside) the
// sticky header, so it scrolls away like the reference.
const MESSAGES = [
  "Free shipping to United States over $100 (Private collections excluded)",
  "Sign up for our newsletter and get 10% off your first order",
];

// Enough repetitions that one half always exceeds the viewport width.
const GROUP = [...MESSAGES, ...MESSAGES, ...MESSAGES];

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-[#000000] py-2">
      <p className="sr-only">{MESSAGES.join(". ")}</p>
      <div aria-hidden className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {GROUP.map((text, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-10 font-sans text-[11px] font-medium uppercase tracking-wide text-white"
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
