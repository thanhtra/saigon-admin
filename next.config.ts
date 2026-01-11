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
  // ❌ TẮT StrictMode để tránh render & useEffect chạy 2 lần ở DEV
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
};

export default nextConfig;
