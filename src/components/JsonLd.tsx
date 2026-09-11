/**
 * Structured data for one page. Nodes are wrapped in a @graph so several
 * schemas (a Book and its breadcrumbs, say) travel in one script tag.
 */
export default function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }),
      }}
    />
  );
}
