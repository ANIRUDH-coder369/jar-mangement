import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next2',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
