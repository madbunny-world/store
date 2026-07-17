// Shopify product handles can contain characters like ® (e.g.
// "madbunny®-hello-world-100-mad-red"). Once URL-encoded (%C2%AE) they break
// Next's intercepting-route matcher AND make un-shareable URLs. We route on a
// clean ASCII slug instead and resolve back to the product by matching.
export function slugify(handle: string): string {
  return handle
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
