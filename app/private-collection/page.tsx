import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries";
import { isFineArt } from "@/lib/catalog";
import { toGridCards } from "@/lib/cards";
import CollectionPage from "@/components/CollectionPage";

export const metadata: Metadata = {
  title: "Private Collection",
  description: "Madbunny fine art. Acquired by inquiry.",
};

// Same shape as the other category pages (Gia, 2026-08): centered Splatink
// title, then the museum grid. Replaces the exhibition-catalogue list — its
// placards (No. NN, year · medium · dimensions) rendered empty anyway, since
// fine art carries no custom.* metafields in Shopify yet. Works stay
// inquiry-only: MuseumGrid never draws a SOLD OUT tab on fine art, and the
// Inquire flow lives on the PDP.
export default async function PrivateCollectionPage() {
  const works = (await getAllProducts()).filter(isFineArt);
  const cards = toGridCards(works, { basePath: "/private-collection" });

  return <CollectionPage title="privateCollection" cards={cards} />;
}
