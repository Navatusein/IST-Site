import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  devIndicators: {
    position: "top-left"
  },
  sassOptions: {
    additionalData: '@use "@/shared/styles/utilities/index.scss" as *;'
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",")
};

export default nextConfig;
