"use client";

import { useState, useCallback } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { safeGetEthereum, isWalletAvailable } from '@/lib/wallet-conflict-handler';

interface WalletConnectionState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  authenticateWithSignature: () => Promise<{ address: string; signature: string; message: string }>;
  clearError: () => void;
}

export function useWalletConnection(): WalletConnectionState {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use safe wallet detection
      if (!isWalletAvailable()) {
        setError('Please install MetaMask or another Web3 wallet to connect');
        return;
      }

      const ethereum = safeGetEthereum();
      if (!ethereum) {
        setError('Wallet not accessible. Please refresh the page and try again.');
        return;
      }

      try {
        await ethereum.request({
          method: 'eth_requestAccounts'
        });
        return;
      } catch (err: any) {
        // Handle user rejection
        if (err.code === 4001) {
          setError('Connection request was rejected');
          return;
        }
        
        // Handle wallet conflicts gracefully
        if (err.message?.includes('redefine property') || err.message?.includes('ethereum')) {
          console.warn('Wallet extension conflict detected');
          setError('Wallet extension conflict detected. Please refresh the page and try again.');
          return;
        }
        
        console.warn('Wallet connection attempt failed:', err);
        setError('Failed to connect wallet. Please try again.');
      }
      
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);
      const signature = await signMessageAsync({ message });
      return signature;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, signMessageAsync]);

  const authenticateWithSignature = useCallback(async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    const message = `Authenticate with CLORION\nAddress: ${address}\nTimestamp: ${Date.now()}`;
    
    try {
      const signature = await signMessage(message);
      return {
        address,
        signature,
        message
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isConnected, address, signMessage]);

  return {
    address: address || null,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    authenticateWithSignature,
    clearError
  };
}