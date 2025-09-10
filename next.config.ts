import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Fix cross origin request warning for development
  allowedDevOrigins: ['10.13.2.164'],
  
  // Web3 and crypto compatibility
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
      buffer: false,
      util: false,
    };
    
    // Suppress specific warnings in webpack
    config.ignoreWarnings = [
      /Module not found: Can't resolve 'crypto'/,
      /Module not found: Can't resolve 'stream'/,
      /Critical dependency: the request of a dependency is an expression/,
      /Unable to set window\.solana/,
      /Unable to set window\.phantom/,
    ];
    
    return config;
  },

  // Handle image domains
  images: {
    domains: ['avatars.githubusercontent.com'],
  },

  // Set workspace root to avoid lockfile warnings
  outputFileTracingRoot: '/Users/pritam/Desktop/Dapps/clorion',

  // Add headers to prevent unnecessary resource loading
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
    ];
  },
};

export default nextConfig;
