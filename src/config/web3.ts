import { createAppKit } from '@reown/appkit/react'
import { sepolia, mainnet } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Simple project configuration
const projectId = 'c72b6095a5e8c6bbafe9f2d6b8534d0f' // Using the provided project ID

// Get the current URL dynamically
const getMetadataUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000'; // fallback for SSR
}

// Create wagmiAdapter with minimal config
const wagmiAdapter = new WagmiAdapter({
  networks: [sepolia, mainnet],
  projectId,
  ssr: false // Disable SSR for now to avoid hydration issues
})

// Initialize AppKit only on client side
if (typeof window !== 'undefined') {
  try {
    const appKitInstance = createAppKit({
      adapters: [wagmiAdapter],
      networks: [sepolia, mainnet],
      projectId,
      metadata: {
        name: 'CLORION',
        description: 'Blue Carbon Registry',
        url: getMetadataUrl(), // Use dynamic URL
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      },
      features: {
        analytics: false, // Disable analytics to prevent tracking calls
        email: false,
        socials: [],
        onramp: false,
        swaps: false,
        history: false,
      },
      // Disable unnecessary features to reduce resource loading
      themeMode: 'light',
      themeVariables: {
        '--w3m-font-family': 'inherit', // Use system fonts instead of preloaded ones
        '--w3m-border-radius-master': '8px',
      },
      allowUnsupportedChain: true,
      enableWalletConnect: true,
      enableInjected: true,
      enableEIP6963: true,
      enableCoinbase: false, // Disable Coinbase to prevent 401 errors
    })
    
    // Store AppKit instance globally for use in hooks
    ;(window as any).__appKit = appKitInstance;
  } catch (error) {
    console.warn('AppKit initialization warning:', error);
  }
}

// Export wagmi config
export const config = wagmiAdapter.wagmiConfig

// Create query client with conservative settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})
