import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iyzipay dynamically requires its resource files at runtime (fs.readdirSync +
  // require), which bundlers can't statically resolve — keep it external so
  // Node's own require() handles it instead of Turbopack/webpack.
  serverExternalPackages: ["iyzipay"],
  // serverExternalPackages alone isn't enough on Vercel: its file tracer also
  // can't see the dynamic require() pattern, so the resource files silently
  // don't make it into the deployed serverless function, crashing at runtime
  // even though the build succeeds. Force-include the whole package.
  outputFileTracingIncludes: {
    "/api/iyzico/checkout": ["./node_modules/iyzipay/**/*"],
    "/api/iyzico/callback": ["./node_modules/iyzipay/**/*"],
    "/api/iyzico/**": ["./node_modules/iyzipay/**/*"],
  },
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
