import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
