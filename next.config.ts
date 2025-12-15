import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude 'dns' for client-side builds
      config.resolve.fallback = {
        dns: false,
      };
    }
    return config;
  },
};

export default nextConfig;
