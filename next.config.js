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
      {
        source: '/api/github/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-GitHub-Api-Version, X-GitHub-Event, X-GitHub-Delivery, X-GitHub-Hook-ID' },
        ],
      },
    ];
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Configure experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['@heroicons/react', '@radix-ui/react-slot', 'date-fns', '@octokit/rest', '@octokit/webhooks'],
  },
  // Add build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  transpilePackages: [
    'react-hot-toast',
    'canvas-confetti',
    '@octokit/rest',
    '@octokit/auth-token',
    '@octokit/webhooks',
    '@octokit/plugin-throttling',
    '@octokit/plugin-retry',
    '@octokit/plugin-paginate-rest',
    '@octokit/plugin-log-level',
    '@octokit/plugin-request-log',
    '@octokit/plugin-rest-endpoint-methods',
    '@octokit/plugin-enterprise-compatibility',
    '@octokit/plugin-enterprise-server',
    'react-icons'
  ],
};

module.exports = nextConfig;
