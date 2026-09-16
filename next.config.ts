import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/category placeholders are gone (all photography now), but the header
    // logo (`/logo.svg`, see src/components/layout/Header.tsx) still renders through
    // next/image, so SVG optimization must stay enabled, sandboxed by the CSP below.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [{ source: "/blog", destination: "/insights", permanent: true }];
  },
};

export default nextConfig;
