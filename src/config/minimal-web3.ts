/**
 * Minimal Web3 configuration designed to eliminate resource loading warnings
 * This configuration avoids all unnecessary font loading and API calls
 */

import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'
import { injected, walletConnect } from 'wagmi/connectors'

// Minimal project configuration
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c72b6095a5e8c6bbafe9f2d6b8534d0f';

// Singleton for WalletConnect to prevent multiple initializations
let walletConnectInstance: any = null;

// Create WalletConnect connector with error handling
const createWalletConnectConnector = () => {
  if (walletConnectInstance) {
    return walletConnectInstance;
  }
  
  walletConnectInstance = walletConnect({ 
    projectId,
    metadata: {
      name: 'CLORIT',
      description: 'Blue Carbon Registry',
      url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      icons: []
    },
    showQrModal: false,
  });
  
  return walletConnectInstance;
};

// Singleton for wagmi config
let configInstance: any = null;

// Create minimal wagmi config
export const config = (() => {
  if (configInstance) {
    return configInstance;
  }
  
  configInstance = createConfig({
    chains: [sepolia],
    connectors: [
      injected(), // MetaMask, etc.
      createWalletConnectConnector(), // Simple WalletConnect
    ],
    transports: {
      [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    },
  });
  
  return configInstance;
})();

// Singleton pattern for QueryClient without IndexedDB
class QueryClientSingleton {
  private static instance: QueryClient | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            // Disable persistence to avoid IndexedDB errors
            persister: undefined,
          },
          mutations: {
            retry: 1,
          }
        },
      });
      console.log('✅ QueryClient initialized (singleton)');
    }
    return this.instance;
  }
}

export const queryClient = QueryClientSingleton.getInstance();

// Simple wallet connection helper with better error handling
export const connectWallet = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Check for ethereum provider with conflict prevention
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        throw new Error('No Web3 wallet detected');
      }

      // Prevent ethereum property redefinition errors
      if (ethereum.request) {
        const accounts = await ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        return accounts[0];
      }
    } catch (error: any) {
      // Handle specific wallet conflicts
      if (error.message?.includes('redefine property')) {
        console.warn('Wallet extension conflict detected, attempting fallback');
        return null;
      }
      console.error('Wallet connection failed:', error);
      return null;
    }
  }
  return null;
};
