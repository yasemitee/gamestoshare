import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  }
};

export default nextConfig;
