import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cards.lorcast.io" },
      { protocol: "https", hostname: "*.lorcast.io" }
    ]
  }
};

export default nextConfig;
