import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iyzipay dynamically requires its resource files at runtime (fs.readdirSync +
  // require), which bundlers can't statically resolve — keep it external so
  // Node's own require() handles it instead of Turbopack/webpack.
  serverExternalPackages: ["iyzipay"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
