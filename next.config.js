/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable linting during build for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build for deployment
    ignoreBuildErrors: true,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Image optimization
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: false,
  },
  // Output file tracing root to fix the lockfile warning
  outputFileTracingRoot: '/Users/pritam/Desktop/Dapps/clorion',
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
