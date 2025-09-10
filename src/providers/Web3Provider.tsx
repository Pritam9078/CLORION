'use client'

import React, { ReactNode } from 'react'
import { config, queryClient } from '@/config/web3'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
