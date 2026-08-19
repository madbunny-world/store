import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  // v3 IA: home is the store, buyable PDPs live under /shop, fine art under
  // /private-collection. Permanent so existing links and search ranking follow.
  // NOTE: /collectibles/:handle is NOT here — old collectible URLs split between
  // /shop and /private-collection by catalog lookup, so a server stub at
  // app/collectibles/[handle]/page.tsx routes them.
  async redirects() {
    return [
      { source: "/jointheclub", destination: "/collectorslounge", permanent: true },
      // Old listing pages now have real successors (2026-08): the toys live at
      // /toyfigures, clothing at /clothing.
      { source: "/collectibles", destination: "/toyfigures", permanent: true },
      // The 2026-08 rename of both category pages. /apparel/:handle must come
      // FIRST — Next matches in order, and the bare /apparel rule would
      // otherwise never see :handle URLs, but the reverse would swallow them.
      { source: "/apparel/:handle", destination: "/shop/:handle", permanent: true },
      { source: "/apparel", destination: "/clothing", permanent: true },
      { source: "/helloworldcollection", destination: "/toyfigures", permanent: true },
      { source: "/shop", destination: "/", permanent: true },
      { source: "/about", destination: "/studio", permanent: true },
    ];
  },
};

export default nextConfig;
