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
      'csfdshydwdzexxosevml.supabase.co',
      'graph.facebook.com',
      'platform-lookaside.fbsbx.com',
      'app.turfyeah.com',
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
            value: [
              // Base directive
              "default-src 'self'",
              // Scripts - including necessary unsafe-eval and unsafe-inline
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://*.supabase.in https://vercel.live https://app.turfyeah.com",
              // Frames
              "frame-src 'self' https://vercel.live https://app.turfyeah.com",
              // Connect sources for APIs and WebSocket
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.supabase.in https://accounts.google.com https://www.facebook.com https://www.google.com https://vercel.live",
              // Frame ancestors
              "frame-ancestors 'self' https://app.turfyeah.com",
              // Form submissions
              "form-action 'self' https://accounts.google.com https://www.facebook.com",
              // Styles
              "style-src 'self' 'unsafe-inline'",
              // Images
              "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com",
              // Fonts
              "font-src 'self' data:",
              // Media
              "media-src 'self'",
              // Object sources
              "object-src 'none'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
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
      : 'http://localhost:3000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.turfyeah.com',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwgsbhncprilsuczqmjr.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    PUBLIC_GITHUB_CLIENT_ID: process.env.PUBLIC_GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
  },
  // Make sure the homepage doesn't require authentication
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
