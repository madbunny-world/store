import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/shopify/queries";
import { formatMoney } from "@/lib/money";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Madbunny apparel";

export default async function ApparelOgImage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);

  const title = product?.title ?? "Madbunny";
  const image = product?.featuredImage?.url;
  const price = product
    ? product.availableForSale
      ? formatMoney(product.minPrice)
      : "Sold"
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#151312",
          color: "#FFF8F8",
        }}
      >
        <div style={{ width: 560, display: "flex", background: "#f4f4f4" }}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" width={560} height={630} style={{ objectFit: "cover" }} />
          ) : null}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
            padding: 64,
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 8, color: "#FF402B" }}>MADBUNNY</div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 34 }}>{price}</div>
        </div>
      </div>
    ),
    size,
  );
}
