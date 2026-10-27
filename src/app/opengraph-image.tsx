import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Drake Passage: Salt, rice, produce, spices and fruit exporters, Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoSrc = `data:image/png;base64,${await readFile(join(process.cwd(), "public/logo.png"), "base64")}`;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#e4f1e8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
          <img src={logoSrc} width={142} height={150} alt="" />
          <div style={{ display: "flex", fontSize: 88, fontWeight: 600 }}>
            <span style={{ color: "#0E3B2C" }}>Drake</span>
            <span style={{ color: "#17734A", marginLeft: 20 }}>Passage</span>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#55625A" }}>
          Salt, rice, produce, spices and fruit exporters, Pakistan
        </div>
      </div>
    ),
    size,
  );
}
