import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  devIndicators: {
    position: "top-left"
  }
};

export default nextConfig;
