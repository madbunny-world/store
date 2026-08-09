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
      // /helloworldcollection, apparel is a page again — so /apparel is NOT
      // redirected. Its :handle rule stays: old PDP URLs predate /shop.
      { source: "/collectibles", destination: "/helloworldcollection", permanent: true },
      { source: "/apparel/:handle", destination: "/shop/:handle", permanent: true },
      { source: "/shop", destination: "/", permanent: true },
      { source: "/about", destination: "/studio", permanent: true },
    ];
  },
};

export default nextConfig;
