/* eslint-disable @next/next/no-img-element */

/**
 * Accepted-payment row for the bag (Gia, 2026-08), sitting under the tax
 * notice. Shown even when the bag is empty — the shopper can see what the shop
 * takes before committing.
 *
 * The badges are the official marks from activemerchant/payment_icons (the set
 * Shopify checkout itself renders), desaturated to luminance grayscale at the
 * FILE level to match the brand's monochrome palette. Deliberately not a CSS
 * grayscale() filter: any filter makes Safari rasterise the element at CSS
 * resolution, which is exactly what made the logo sticker jagged/blurry.
 * Re-fetch color originals: raw.githubusercontent.com/activemerchant/
 * payment_icons/master/app/assets/images/payment_icons/<name>.svg, then re-run
 * the desaturation (see git history for the script).
 *
 * Plain <img>, not next/image: they render around 40×26, the sources are tiny
 * vectors, and the optimizer would only rasterise them.
 *
 * The list must match what the store actually accepts in Shopify Admin —
 * advertising a method that fails at checkout is worse than showing none.
 */

// All seven files are complete 38×24 card badges — apple_pay.svg draws its own
// black frame, so none of them need one added.
const METHODS = [
  { name: "Apple Pay", file: "apple_pay" },
  { name: "Diners Club", file: "diners_club" },
  { name: "Discover", file: "discover" },
  { name: "Google Pay", file: "google_pay" },
  { name: "JCB", file: "jcb" },
  { name: "Mastercard", file: "master" },
  { name: "Visa", file: "visa" },
];

export default function PaymentMethods() {
  return (
    // A list, not a bare row of images: this is a statement about what the shop
    // takes, so it needs a label for screen readers rather than seven stray
    // graphics.
    //
    // The row never wraps (Gia, 2026-08). Each badge is flex-1 so the seven
    // share the width evenly and shrink together on a narrow phone, capped at
    // 41px so they stop growing once the drawer is wide enough. Height follows
    // from the 38:24 ratio, so they stay proportional at every size.
    <div className="px-5 pb-4">
      <h2 className="sr-only">Accepted payment methods</h2>
      <ul className="flex items-center gap-1.5">
        {METHODS.map((m) => (
          <li key={m.name} title={m.name} className="min-w-0 flex-1 basis-0 max-w-[41px]">
            <span className="sr-only">{m.name}</span>
            <img
              src={`/media/payments/${m.file}.svg`}
              alt=""
              width={38}
              height={24}
              className="block h-auto w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
