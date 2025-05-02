/** @type {import('next').NextConfig} */
const { cspToString, cspConfig } = require('./csp-config');

// Testing new Vercel webhook integration
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'github.com',
      'raw.githubusercontent.com',
      'user-images.githubusercontent.com',
      'localhost',
      'media.giphy.com',
    ],
  },
  // Change from 'server' to 'standalone'
  output: 'standalone',
  // Disable static error page generation
  distDir: process.env.BUILD_DIR || '.next',
  // Add headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspToString(cspConfig),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // Transpile packages
  transpilePackages: [
    '@octokit/rest',
    '@octokit/auth-token',
    '@octokit/plugin-paginate-rest',
    '@octokit/plugin-retry',
    '@octokit/plugin-throttling',
    '@octokit/webhooks',
  ],
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib', 'hooks', 'pages', 'utils'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure metadata base URL
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  },
};

module.exports = nextConfig;
