"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { CTA_BAR_CLASS } from "./BuyPanel";

// Collector inquiry form for fine-art pieces (inquiry-only, no cart). Opened from
// the Inquire CTA in BuyPanel, which renders both on the full detail page and
// inside the z-30 product modal — hence z-[80], above the cart drawer (z-70),
// floating cart (z-60), nav (z-40) and that modal.

const INPUT_CLASS =
  "w-full flex-1 bg-transparent px-4 py-3 font-sans text-[13px] text-black outline-none placeholder:text-gun-metal/70";

// Mounted only while open (BuyPanel gates it), so every open starts with a clean
// form — returning null from a still-mounted component would keep useState alive
// and strand the success message after the first submit.
export default function InquiryDialog({
  onClose,
  productTitle,
  price,
}: {
  onClose: () => void;
  productTitle: string;
  price: string;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  // Held in a ref so the mount effect below can stay on empty deps — a changing
  // onClose identity would re-run it every render and clobber the saved scroll
  // value with the locked one.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Escape + scroll lock, once per open. The listener is registered in the
  // CAPTURE phase and stops propagation: the product modal binds its own
  // bubble-phase keydown on document that calls router.back(), so without this a
  // single Escape would close this dialog AND navigate away. First Escape closes
  // the dialog; a second one reaches the modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKey, true);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement as HTMLElement | null;

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    setError(false);
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          address,
          note,
          company,
          productTitle,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("done");
        setMessage("Inquiry sent. We will be in touch.");
      } else {
        setStatus("idle");
        setError(true);
        setMessage(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("idle");
      setError(true);
      setMessage("Something went wrong. Try again.");
    }
  }

  const ready =
    email.trim() !== "" && fullName.trim() !== "" && address.trim() !== "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-heading"
      className="fixed inset-0 z-[80] flex items-stretch justify-center sm:items-start sm:overflow-y-auto sm:py-12"
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/50" aria-hidden />

      <div className="relative z-10 flex w-full flex-col overflow-y-auto bg-white px-5 pb-8 pt-16 sm:my-auto sm:h-auto sm:max-w-md sm:overflow-visible sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-16 z-10 -m-2 p-2 hover:opacity-60 sm:right-8 sm:top-8"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <h2 id="inquiry-heading" className="font-sans text-[16px] font-bold md:text-[18px]">
          Private collection inquiry
        </h2>
        <p className="mt-1 font-mono text-[12px] text-gun-metal">
          {productTitle} — {price}
        </p>

        {status === "done" ? (
          <p role="status" className="mt-6 font-mono text-[12px] text-black">
            {message}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6">
            {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <label htmlFor="inquiry-email" className="sr-only">
              Email address
            </label>
            <div className="flex bg-card">
              <input
                id="inquiry-email"
                name="email"
                type="email"
                required
                autoFocus
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={INPUT_CLASS}
              />
            </div>

            <label htmlFor="inquiry-name" className="sr-only">
              Full name
            </label>
            <div className="mt-2 flex bg-card">
              <input
                id="inquiry-name"
                name="fullName"
                type="text"
                required
                maxLength={120}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className={INPUT_CLASS}
              />
            </div>

            <label htmlFor="inquiry-address" className="sr-only">
              Address
            </label>
            <div className="mt-2 flex bg-card">
              <textarea
                id="inquiry-address"
                name="address"
                required
                rows={2}
                maxLength={400}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <label htmlFor="inquiry-note" className="sr-only">
              Note
            </label>
            <div className="mt-2 flex bg-card">
              <textarea
                id="inquiry-note"
                name="note"
                rows={3}
                maxLength={1000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optional)"
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !ready}
              className={`${CTA_BAR_CLASS} mt-4 justify-center bg-black hover:opacity-80 disabled:opacity-30`}
            >
              {status === "loading" ? "Sending" : "Send inquiry"}
            </button>

            {message && (
              <p
                role="status"
                className={`mt-3 text-center font-mono text-[12px] ${
                  error ? "text-mad-red" : "text-black"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
