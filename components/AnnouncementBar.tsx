import Link from "next/link";
import HashLink from "./HashLink";

// Thin black announcement strip above the header: the two messages repeat and
// flow right-to-left in a seamless CSS marquee (two identical halves, track
// translates -50% and loops). Sits above (not inside) the sticky header, so it
// scrolls away like the reference.
//
// Messages are segment arrays so parts of a sentence can carry a link. The
// moving copy is aria-hidden and its links are tabIndex={-1} — 12 duplicates of
// each link would otherwise litter the tab order and the screen-reader output.
// The sr-only block below carries one real, focusable copy of each message.
type Segment = { text: string; href?: string };

const MESSAGES: Segment[][] = [
  [
    { text: "Free shipping to U.S. over $100 (" },
    { text: "Private collections", href: "/private-collection" },
    { text: " excluded)" },
  ],
  [
    // The newsletter lives in the footer on every page, so a same-page anchor
    // reaches it from anywhere. globals.css makes the jump smooth.
    { text: "Sign up for Madclub", href: "#madclub" },
    { text: " and get 10% off" },
  ],
];

// Enough repetitions that one half always exceeds the viewport width.
const GROUP = [...MESSAGES, ...MESSAGES, ...MESSAGES];

const LINK_CLASS = "underline underline-offset-2 hover:opacity-70";

function Segments({ segments, hidden }: { segments: Segment[]; hidden?: boolean }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.href ? (
          seg.href.startsWith("#") ? (
            <HashLink
              key={i}
              href={seg.href}
              className={LINK_CLASS}
              {...(hidden ? { tabIndex: -1 } : {})}
            >
              {seg.text}
            </HashLink>
          ) : (
            <Link
              key={i}
              href={seg.href}
              className={LINK_CLASS}
              {...(hidden ? { tabIndex: -1 } : {})}
            >
              {seg.text}
            </Link>
          )
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-[#000000] py-2">
      <p className="sr-only">
        {MESSAGES.map((segments, i) => (
          <span key={i}>
            <Segments segments={segments} />.{" "}
          </span>
        ))}
      </p>
      <div aria-hidden className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {GROUP.map((segments, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-10 font-sans text-[11px] font-medium uppercase tracking-wide text-white"
              >
                <Segments segments={segments} hidden />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
