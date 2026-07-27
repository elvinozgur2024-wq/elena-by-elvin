import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's image optimizer started returning 402 (quota exhausted) for
    // every transform, which broke images site-wide. We don't need it: the
    // admin upload pipeline already resizes to <=1600px and encodes WebP
    // q82 (avg ~63KB), and the logo ships pre-sized. Serving the stored
    // files directly removes the dependency and the recurring bill.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Admin photo uploads go through Server Actions; the 1 MB default
      // rejected any PNG over ~1 MB with a 413 before the action ran.
      // 4mb stays under Vercel's ~4.5 MB request body cap, so the platform
      // limit never produces a confusing second failure mode.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
