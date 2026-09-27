import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remaining optimized images: thumbnails and cards up to 332 CSS px at 3x.
    deviceSizes: [384, 640, 1080],
    imageSizes: [32, 64, 128, 256],
    qualities: [75],
    formats: ["image/webp"],
    // Version the source URL when replacing an image within this 30-day window.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "cards.lorcast.io" },
      { protocol: "https", hostname: "*.lorcast.io" }
    ]
  }
};

export default nextConfig;
