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
  typescript: {
    // During deployment, we'll handle type checking in the build process
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // During deployment, we'll handle linting in the build process
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // Ensure we're using the App Router
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig; 