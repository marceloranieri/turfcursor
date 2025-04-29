/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: [
      'avatars.githubusercontent.com',
      'github.com',
      'raw.githubusercontent.com',
      'user-images.githubusercontent.com',
    ],
  },
};

module.exports = nextConfig; 