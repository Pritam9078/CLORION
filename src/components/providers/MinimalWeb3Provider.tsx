"use client";

import { ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '@/config/minimal-web3'
import { ensureCryptoRandomUUID } from '@/lib/crypto-polyfill'

interface MinimalWeb3ProviderProps {
  children: ReactNode
}

// Singleton to prevent multiple provider initializations
let isProviderInitialized = false;

export function MinimalWeb3Provider({ children }: MinimalWeb3ProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Prevent multiple initializations
        if (isProviderInitialized) {
          setIsInitialized(true);
          return;
        }

        // Ensure crypto polyfill is available first
        ensureCryptoRandomUUID();
        
        // Simple initialization without heavy Web3Modal
        isProviderInitialized = true;
        setIsInitialized(true);
        
        console.log('✅ Minimal Web3 provider initialized (singleton)');
      } catch (error) {
        console.warn('Web3 initialization warning:', error);
        setIsInitialized(true);
      }
    };

    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
  );
}
