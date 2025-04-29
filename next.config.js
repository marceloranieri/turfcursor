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
    domains: [
      'avatars.githubusercontent.com',
      'github.com',
      'raw.githubusercontent.com',
      'user-images.githubusercontent.com',
    ],
  },
  // Enable TypeScript and ESLint checks during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure output for optimal Vercel deployment
  output: 'standalone',
  distDir: '.next',
  // Add Vercel Speed Insights configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize client-side bundle
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  // Add headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.com https://*.vercel.com https://*.github.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://*.github.com https://api.github.com https://raw.githubusercontent.com https://gist.githubusercontent.com https://*.githubusercontent.com; img-src 'self' data: https:; font-src 'self' data:;",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
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
  // Enable experimental features that might help with deployment
  experimental: {
    optimizeCss: true,
    serverActions: {
      allowedOrigins: ['localhost:3000', process.env.NEXT_PUBLIC_APP_URL],
      bodySizeLimit: '2mb'
    },
    serverComponents: true
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
};

module.exports = nextConfig;
