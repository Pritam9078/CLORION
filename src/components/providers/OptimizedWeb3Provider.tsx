"use client";

import { ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient, initializeWeb3 } from '@/config/web3-optimized'
import { ensureCryptoRandomUUID } from '@/lib/crypto-polyfill'

interface OptimizedWeb3ProviderProps {
  children: ReactNode
}

export function OptimizedWeb3Provider({ children }: OptimizedWeb3ProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Ensure crypto polyfill is available first
        ensureCryptoRandomUUID();
        
        // Initialize Web3 with performance optimizations
        await initializeWeb3();
        
        setIsInitialized(true);
      } catch (error) {
        console.warn('Web3 initialization warning:', error);
        // Still allow the app to load even if there are Web3 issues
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Initializing Web3...</div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
