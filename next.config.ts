import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  devIndicators: {
    position: "top-left"
  },
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(","),
  redirects: async () => [{source: "/", destination: "/home", permanent: false}],
  headers: async () => [{
    source: "/files/:path*",
    headers: [
      {key: "X-Content-Type-Options", value: "nosniff"},
      {key: "Content-Security-Policy", value: "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'"}
    ]
  }],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    },
  }
};

export default nextConfig;
