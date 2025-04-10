import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  devIndicators: {
    position: "top-right"
  }
};

export default nextConfig;
