// Root fallback 404 for paths OUTSIDE the [locale] tree. The root layout is a pass-through with
// no <html>, and globals.css is only imported in [locale]/layout, so this page brings its own
// document + inline styles. Localized 404s are handled by app/[locale]/not-found.tsx.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
          color: "#fff",
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          background:
            "radial-gradient(55rem 38rem at 70% -10%, rgba(56,189,248,0.20), transparent 60%), linear-gradient(180deg, #0a1628 0%, #060d1a 100%)",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            backgroundImage: "linear-gradient(90deg, #38bdf8, #67e8f9, #818cf8)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          404
        </div>
        <h1 style={{ marginTop: "12px", fontSize: "26px", fontWeight: 600 }}>
          This page went off the grid
        </h1>
        <p style={{ marginTop: "12px", maxWidth: "28rem", color: "#cbd5e1" }}>
          The page you’re looking for doesn’t exist or may have moved — let’s get you back online.
        </p>
        <a
          href="/"
          style={{
            marginTop: "28px",
            display: "inline-flex",
            height: "48px",
            alignItems: "center",
            borderRadius: "9999px",
            background: "#38bdf8",
            padding: "0 28px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#06121f",
            textDecoration: "none",
          }}
        >
          Back to home
        </a>
      </body>
    </html>
  );
}
