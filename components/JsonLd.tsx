// Renders a schema.org JSON-LD block. The data is built in lib/seo.ts from our
// own Shopify records — never user input — so serializing it is safe.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
