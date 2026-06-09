import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social card for the whole site (pages can override).
export default function OpengraphImage() {
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
            "radial-gradient(900px 600px at 75% -10%, #0ea5e9 0%, transparent 55%), linear-gradient(135deg, #0a1628 0%, #060d1a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #7dd3fc, #818cf8)",
              display: "flex",
            }}
          />
          {site.name}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          The VPN that stays invisible and fast.
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "#94a3b8",
            maxWidth: 900,
          }}
        >
          No-logs · Censorship-resistant · Every device
        </div>
      </div>
    ),
    size,
  );
}
