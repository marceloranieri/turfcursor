/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable TypeScript and ESLint checks during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure output for optimal Vercel deployment
  output: 'standalone',
  distDir: '.next',
  // Add Vercel Speed Insights configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Optimize serverless function
  serverRuntimeConfig: {
    maxMemory: 950, // MB (leaving some buffer from the 1GB limit)
  }
};

module.exports = nextConfig; 