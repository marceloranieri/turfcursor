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
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com data:",
              // Scripts - Added more Supabase domains
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co https://*.supabase.in https://*.vercel.app https://app.turfyeah.com https://vercel.live https://cdn.vercel-insights.com",
              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images - Added Supabase domains
              "img-src 'self' https: data: blob: https://*.supabase.co https://*.supabase.in",
              // Connect - Added more Supabase endpoints
              "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://app.turfyeah.com https://vercel.live https://*.vercel.app https://vitals.vercel-insights.com",
              // Media
              "media-src 'self' https: data:",
              // Frames - Added Supabase domains
              "frame-src 'self' https://*.supabase.co https://*.supabase.in https://vercel.live",
              // Worker
              "worker-src 'self' blob:",
              // Manifest
              "manifest-src 'self'",
              // Form actions
              "form-action 'self'",
              // Base URI
              "base-uri 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
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
};

module.exports = nextConfig;
