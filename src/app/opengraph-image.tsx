import { ImageResponse } from "next/og";

export const alt = "Drake Passage — salt, rice and fresh produce exporters, Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0b2545", color: "#f4f7f6", fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 40 }}>Drake Passage Pvt Limited</div>
        <div style={{ fontSize: 64, lineHeight: 1.1, maxWidth: 900 }}>Salt, rice and fresh produce from Pakistan, packed to your spec</div>
        <div style={{ fontSize: 28, color: "#22b8bc" }}>FOB or CIF · Samples by DHL or Leopard</div>
      </div>
    ),
    size,
  );
}
