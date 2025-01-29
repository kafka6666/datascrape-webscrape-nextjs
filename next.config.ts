import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      enabled: true,
    } as never,
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    // domains: ['m.media-amazon.com']
  },
};

export default nextConfig;
