"use client";

import { ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '@/config/web3'
import { ensureCryptoRandomUUID } from '@/lib/crypto-polyfill'

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ensure crypto polyfill is available before initializing Web3
    try {
      ensureCryptoRandomUUID();
      setIsInitialized(true);
    } catch (error) {
      console.warn('Web3 initialization warning:', error);
      // Still allow the app to load even if there are Web3 issues
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
