// import { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Exclude 'dns' for client-side builds
//       config.resolve.fallback = {
//         dns: false,
//       };
//     }
//     return config;
//   },
// };

// export default nextConfig;


import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  reactStrictMode: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
