import { ImageResponse } from "next/og";

export const alt = "Drake Passage: Himalayan salt and Basmati rice exporters, Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Path data copied from public/logo.svg (the DP monogram mark).
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
          background: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width={120} height={120} viewBox="0 0 64 64" fill="none">
            <path
              fill="#0F8286"
              fillRule="evenodd"
              d="M36 12h11c8.5 0 13 5 13 12s-4.5 12-13 12h-5v10h-6zm6 6v12h5c4.5 0 7-2.5 7-6s-2.5-6-7-6z"
            />
            <path
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={2.4}
              strokeLinejoin="round"
              d="M12 2c20 0 30 10 30 22 0 10-6 18-16 22L12 36z"
            />
            <path
              fill="#0B2545"
              fillRule="evenodd"
              d="M12 2c20 0 30 10 30 22 0 10-6 18-16 22L12 36zm5.5 7v24l9 7c6-3 10-9 10-16 0-9-6.5-15-19-15z"
            />
            <path fill="#0B2545" d="M21.5 12.5l10.5 21-10.5-5.5z" />
            <path
              fill="none"
              stroke="#0B2545"
              strokeWidth={2.8}
              strokeLinecap="round"
              d="M8 51c7.5-5 15-5 22.5 0s15 5 22.5 0"
            />
            <path
              fill="none"
              stroke="#22B8BC"
              strokeWidth={2.8}
              strokeLinecap="round"
              d="M4 56c9-5 18-5 27 0s18 5 27 0"
            />
            <path
              fill="none"
              stroke="#0B2545"
              strokeWidth={2.8}
              strokeLinecap="round"
              d="M10 61c7.5-5 15-5 22.5 0s15 5 22.5 0"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 600 }}>
            <span style={{ color: "#0B2545" }}>Drake</span>
            <span style={{ color: "#0F8286", marginLeft: 20 }}>Passage</span>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#5a6b72" }}>
          Himalayan salt and Basmati rice exporters, Pakistan
        </div>
      </div>
    ),
    size,
  );
}
