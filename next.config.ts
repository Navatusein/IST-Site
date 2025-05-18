import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",
  // modularizeImports: {
  //   antd: {
  //     transform: "antd/es/{{member}}",
  //     preventFullImport: true,
  //   },
  //   "@ant-design/icons": {
  //     transform: "@ant-design/icons/es/icons/{{member}}",
  //     preventFullImport: true,
  //   },
  // },
  // transpilePackages: [
  //   "@ant-design/icons",
  //   "antd",
  // ],
  // experimental: {
  //   optimizePackageImports: [
  //     "@ant-design/icons",
  //     "antd",
  //   ],
  // },
  // compiler: {
  //   reactRemoveProperties: true,
  //   removeConsole: { exclude: ["error", "warn"] },
  // },
  devIndicators: {
    position: "top-left"
  },
  sassOptions: {
    additionalData: '@use "@/shared/styles/utilities/index.scss" as *;'
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(",")
};

export default nextConfig;
