/**
 * Optimized Web3 configuration with minimal resource loading
 * Prevents font preloading warnings and unnecessary API calls
 */

import { createAppKit } from '@reown/appkit/react'
import { sepolia } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Project configuration
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c72b6095a5e8c6bbafe9f2d6b8534d0f';

// Get the current URL dynamically
const getMetadataUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3001'; // Updated to match current port
}

// Create wagmi adapter with optimized config
const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia], // Only use sepolia for now to reduce complexity
  projectId,
  ssr: false
})

// Optimized AppKit configuration
let appKitInstance: any = null;

// Initialize AppKit with performance optimizations
export const initializeWeb3 = () => {
  if (typeof window === 'undefined' || appKitInstance) {
    return appKitInstance;
  }

  try {
    appKitInstance = createAppKit({
      adapters: [wagmiAdapter],
      networks: [sepolia],
      projectId,
      metadata: {
        name: 'CLORIT',
        description: 'Blue Carbon Registry',
        url: getMetadataUrl(),
        icons: []
      },
      features: {
        analytics: false,
        email: false,
        socials: [],
        onramp: false,
        swaps: false,
        history: false,
      },
      themeMode: 'light',
      themeVariables: {
        '--w3m-font-family': 'inherit',
        '--w3m-font-size-master': '14px',
        '--w3m-border-radius-master': '8px',
      },
      allowUnsupportedChain: true,
      enableWalletConnect: true,
      enableInjected: true,
      enableEIP6963: false, // Disable to reduce complexity
      enableCoinbase: false, // Disable to prevent 401 errors
    });

    return appKitInstance;
  } catch (error) {
    console.warn('AppKit initialization failed:', error);
    return null;
  }
};

// Export wagmi config
export const config = wagmiAdapter.wagmiConfig;

// Create optimized query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Export the initialization function
export { appKitInstance };
