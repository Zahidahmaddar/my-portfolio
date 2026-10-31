import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets e2e runs build beside a running dev server without clobbering .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // A stray lockfile in a parent folder must not change what gets traced
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
