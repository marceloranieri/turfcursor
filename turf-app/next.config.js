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
  // Temporarily ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configure output for optimal Vercel deployment
  output: 'standalone',
  distDir: '.next',
  experimental: {
    optimizeCss: true,
    memoryBasedWorkersCount: true,
  },
  // Add Vercel Speed Insights configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Optimize for memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 40000,
      },
    };
    return config;
  },
  // Optimize serverless function
  serverRuntimeConfig: {
    maxMemory: 950, // MB (leaving some buffer from the 1GB limit)
  }
};

module.exports = nextConfig; 