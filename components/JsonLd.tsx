// Renders a JSON-LD <script> server-side for rich results.
// Usage: <JsonLd data={{ "@context": "https://schema.org", ... }} />

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject here (no user input).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
