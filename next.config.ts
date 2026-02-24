import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  devIndicators: {
    position: "top-left"
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(","),
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb"
    },
  }
};

export default nextConfig;
