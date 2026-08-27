import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social card for the whole site (pages can override).
export default function OpengraphImage() {
  // Embed the real logo so the OG card is on-brand.
  const logo = readFileSync(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 600px at 78% -10%, #0ea5e9 0%, transparent 55%), linear-gradient(135deg, #0a1628 0%, #060d1a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={72} height={72} alt="" />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            {site.name}
          </div>
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          Private internet that actually works.
        </div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#94a3b8" }}>
          Stealth Mode · No-logs · 40+ locations · Start free
        </div>
      </div>
    ),
    size,
  );
}
