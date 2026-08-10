// Domain types for the storefront. Raw Shopify shapes are normalized in queries.ts.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  /** null when inventory isn't tracked. Drives the "N left" counter (≤3). */
  quantityAvailable: number | null;
  selectedOptions: SelectedOption[];
  price: Money;
  image: Image | null;
  // Variant-level metafields (D-07).
  medium: string | null;
  editionSize: number | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  /** Plain text; for meta descriptions and structured data. */
  description: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  options: ProductOption[];
  minPrice: Money;
  featuredImage: Image | null;
  images: Image[];
  variants: ProductVariant[];
  // Product-level metafields.
  year: number | null;
  dimensionsMetric: string | null;
  dimensionsIn: string | null;
  scale: string | null;
  tier: string | null;
  // PDP accordion sections (multi-line text, set in Admin on apparel;
  // rows hide when null).
  productDetails: string | null;
  fabric: string | null;
  careInstructions: string | null;
};

// ---- Cart ----

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string };
    image: Image | null;
    price: Money;
  };
  cost: { totalAmount: Money };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};
