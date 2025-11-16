import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `images.remotePatterns` es preferible a `images.domains` en Next.js reciente
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
