import { useState, useEffect, useCallback } from 'react';
import { alchemyService, blockchainUtils } from '@/lib/alchemy';
import type { Block } from 'viem';

export interface UseBlockchainDataResult {
  // Current blockchain state
  currentBlock: Block | null;
  gasPrice: string | null;
  chainId: number | null;
  networkName: string;
  isConnected: boolean;
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  validateNetwork: () => Promise<boolean>;
  
  // Utility functions
  formatAddress: (address: string) => string;
  formatTransactionHash: (hash: string) => string;
  weiToEther: (wei: bigint) => string;
  etherToWei: (ether: string) => bigint;
}

export interface UseWalletBalanceResult {
  balance: string | null;
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
}

export interface UseTransactionResult {
  transaction: any | null;
  receipt: any | null;
  loading: boolean;
  error: string | null;
  fetchTransaction: (hash: string) => Promise<void>;
}

// Hook for general blockchain data
export function useBlockchainData(): UseBlockchainDataResult {
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [block, price, id, connected] = await Promise.all([
        alchemyService.getCurrentBlock(),
        alchemyService.getGasPrice(),
        alchemyService.getChainId(),
        alchemyService.validateNetwork()
      ]);

      setCurrentBlock(block);
      setGasPrice(alchemyService.weiToEther(price));
      setChainId(id);
      setIsConnected(connected);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blockchain data';
      setError(errorMessage);
      setIsConnected(false);
      console.error('Blockchain data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const validateNetwork = useCallback(async () => {
    try {
      const isValid = await alchemyService.validateNetwork();
      setIsConnected(isValid);
      return isValid;
    } catch (err) {
      console.error('Network validation error:', err);
      setIsConnected(false);
      return false;
    }
  }, []);

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    currentBlock,
    gasPrice,
    chainId,
    networkName: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
    isConnected,
    loading,
    error,
    refreshData,
    validateNetwork,
    formatAddress: blockchainUtils.formatAddress,
    formatTransactionHash: blockchainUtils.formatTransactionHash,
    weiToEther: alchemyService.weiToEther,
    etherToWei: alchemyService.etherToWei
  };
}

// Hook for wallet balance
export function useWalletBalance(address?: string): UseWalletBalanceResult {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!address || !alchemyService.isValidAddress(address)) {
      setError('Invalid address');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const walletBalance = await alchemyService.getETHBalance(address);
      setBalance(walletBalance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(errorMessage);
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      refreshBalance();
    }
  }, [address, refreshBalance]);

  return {
    balance,
    loading,
    error,
    refreshBalance
  };
}

// Hook for transaction data
export function useTransaction(): UseTransactionResult {
  const [transaction, setTransaction] = useState<any | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async (hash: string) => {
    if (!hash) {
      setError('Transaction hash is required');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const [txData, txReceipt] = await Promise.all([
        alchemyService.getTransaction(hash),
        alchemyService.getTransactionReceipt(hash).catch(() => null) // Receipt might not exist yet
      ]);

      setTransaction(txData);
      setReceipt(txReceipt);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction';
      setError(errorMessage);
      console.error('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transaction,
    receipt,
    loading,
    error,
    fetchTransaction
  };
}

// Hook for block monitoring
export function useBlockMonitor(callback?: (block: Block) => void) {
  const [latestBlock, setLatestBlock] = useState<Block | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMonitoring = useCallback(async () => {
    try {
      setError(null);
      setIsMonitoring(true);
      
      const unwatch = await alchemyService.watchBlocks((block) => {
        setLatestBlock(block);
        if (callback) {
          callback(block);
        }
      });

      return unwatch;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start block monitoring';
      setError(errorMessage);
      setIsMonitoring(false);
      console.error('Block monitoring error:', err);
    }
  }, [callback]);

  return {
    latestBlock,
    isMonitoring,
    error,
    startMonitoring
  };
}

// Hook for network statistics
export function useNetworkStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const networkStats = await alchemyService.getBlockchainStats();
      setStats(networkStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch network stats';
      setError(errorMessage);
      console.error('Network stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
    
    // Refresh every minute
    const interval = setInterval(refreshStats, 60000);
    
    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    loading,
    error,
    refreshStats
  };
}

// Utility hook for blockchain operations
export function useBlockchainUtils() {
  return {
    formatAddress: blockchainUtils.formatAddress,
    formatTransactionHash: blockchainUtils.formatTransactionHash,
    formatGasPrice: blockchainUtils.formatGasPrice,
    calculateTransactionFee: blockchainUtils.calculateTransactionFee,
    isTestnet: blockchainUtils.isTestnet(),
    isValidAddress: alchemyService.isValidAddress,
    weiToEther: alchemyService.weiToEther,
    etherToWei: alchemyService.etherToWei
  };
}
