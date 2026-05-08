import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'otogeorgia.ge' },
      { protocol: 'https', hostname: '**.otogeorgia.ge' },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
