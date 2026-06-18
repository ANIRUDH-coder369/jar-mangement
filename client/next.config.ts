import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next',
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
