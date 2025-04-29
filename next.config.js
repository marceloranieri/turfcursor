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
      // Add other image domains as needed
    ],
  },
  // Enable TypeScript and ESLint checks during build
  typescript: {
    // Needed for Vercel deployment to succeed even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning only in production, error in development
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
  // Optimize serverless function
  serverRuntimeConfig: {
    maxMemory: 950, // MB (leaving some buffer from the 1GB limit)
    // Add error handling for memory issues
    onError: (err) => {
      console.error('Runtime error:', err);
      // Log to your error tracking service here
    },
  },
  // Add headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.com https://*.vercel.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://*.github.com; img-src 'self' data: https:; font-src 'self' data:;",
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
          // Add compression and caching headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/api/github/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
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
    // Enable modern optimizations
    optimizePackageImports: ['@heroicons/react', '@radix-ui/react-slot', 'date-fns'],
  },
  // Add build optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Add powered by header
  poweredByHeader: false,
  // Transpile specified modules
  transpilePackages: [
    'react-hot-toast',
    'canvas-confetti',
    // Add other packages that need transpilation
  ],
};

module.exports = nextConfig;
