import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  devIndicators: {
    position: "top-left"
  },
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(","),
  redirects: async () => [{source: "/", destination: "/home", permanent: false}],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    },
  }
};

export default nextConfig;
