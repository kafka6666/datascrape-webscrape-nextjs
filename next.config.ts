import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      enabled: true,
    } as never,
  },
    serverExternalPackages: ['mongoose'],
  images: {
    remotePatterns: [{hostname: 'm.media-amazon.com'}]
  },
};

export default nextConfig;
