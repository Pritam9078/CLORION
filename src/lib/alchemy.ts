import { createPublicClient, createWalletClient, http, Block, parseEther, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Types for blockchain operations
export interface BlockchainConfig {
  rpcUrl: string;
  apiKey: string;
  chainId: number;
  networkName: string;
}

export interface CarbonCreditToken {
  tokenId: string;
  projectId: string;
  amount: number;
  price: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface TransactionResult {
  hash: string;
  blockNumber: bigint;
  status: 'success' | 'failed';
  gasUsed: bigint;
  gasPrice: bigint;
}

export interface MarketplaceActivity {
  transactionHash: string;
  blockNumber: bigint;
  timestamp: Date;
  type: 'mint' | 'transfer' | 'trade' | 'burn';
  from: string;
  to: string;
  tokenId: string;
  amount: number;
  price?: number;
}

class AlchemyBlockchainService {
  private publicClient;
  private walletClient;
  private config: BlockchainConfig;

  constructor() {
    this.config = {
      rpcUrl: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || '',
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111'),
      networkName: process.env.NEXT_PUBLIC_NETWORK || 'sepolia'
    };

    // Create public client for reading blockchain data
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(this.config.rpcUrl),
    });

    // Create wallet client for transactions (only if private key is available)
    if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
      this.walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(this.config.rpcUrl),
      });
    }
  }

  // Get current block information
  async getCurrentBlock(): Promise<Block> {
    try {
      const block = await this.publicClient.getBlock({
        blockTag: 'latest'
      });
      return block;
    } catch (error) {
      console.error('Error fetching current block:', error);
      throw new Error('Failed to fetch current block');
    }
  }

  // Get specific block by number
  async getBlock(blockNumber: bigint): Promise<Block> {
    try {
      const block = await this.publicClient.getBlock({
        blockNumber
      });
      return block;
    } catch (error) {
      console.error(`Error fetching block ${blockNumber}:`, error);
      throw new Error(`Failed to fetch block ${blockNumber}`);
    }
  }

  // Get transaction details
  async getTransaction(hash: string) {
    try {
      const transaction = await this.publicClient.getTransaction({
        hash: hash as `0x${string}`
      });
      return transaction;
    } catch (error) {
      console.error(`Error fetching transaction ${hash}:`, error);
      throw new Error(`Failed to fetch transaction ${hash}`);
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(hash: string) {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: hash as `0x${string}`
      });
      return receipt;
    } catch (error) {
      console.error(`Error fetching transaction receipt ${hash}:`, error);
      throw new Error(`Failed to fetch transaction receipt ${hash}`);
    }
  }

  // Get ETH balance
  async getETHBalance(address: string): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: address as `0x${string}`
      });
      return formatEther(balance);
    } catch (error) {
      console.error(`Error fetching ETH balance for ${address}:`, error);
      throw new Error(`Failed to fetch ETH balance for ${address}`);
    }
  }

  // Get gas price
  async getGasPrice(): Promise<bigint> {
    try {
      const gasPrice = await this.publicClient.getGasPrice();
      return gasPrice;
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw new Error('Failed to fetch gas price');
    }
  }

  // Estimate gas for a transaction
  async estimateGas(transaction: any): Promise<bigint> {
    try {
      const gasEstimate = await this.publicClient.estimateGas(transaction);
      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  // Get network information
  getNetworkInfo() {
    return {
      name: this.config.networkName,
      chainId: this.config.chainId,
      rpcUrl: this.config.rpcUrl.replace(this.config.apiKey, '***'),
      isTestnet: this.config.networkName !== 'mainnet'
    };
  }

  // Validate address format
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Convert wei to ether
  weiToEther(wei: bigint): string {
    return formatEther(wei);
  }

  // Convert ether to wei
  etherToWei(ether: string): bigint {
    return parseEther(ether);
  }

  // Get block transactions
  async getBlockTransactions(blockNumber: bigint) {
    try {
      const block = await this.publicClient.getBlock({
        blockNumber,
        includeTransactions: true
      });
      return block.transactions;
    } catch (error) {
      console.error(`Error fetching block transactions for ${blockNumber}:`, error);
      throw new Error(`Failed to fetch block transactions for ${blockNumber}`);
    }
  }

  // Monitor new blocks
  async watchBlocks(callback: (block: Block) => void) {
    try {
      const unwatch = this.publicClient.watchBlocks({
        onBlock: callback
      });
      return unwatch;
    } catch (error) {
      console.error('Error watching blocks:', error);
      throw new Error('Failed to watch blocks');
    }
  }

  // Get chain ID
  async getChainId(): Promise<number> {
    try {
      const chainId = await this.publicClient.getChainId();
      return chainId;
    } catch (error) {
      console.error('Error fetching chain ID:', error);
      throw new Error('Failed to fetch chain ID');
    }
  }

  // Check if connected to correct network
  async validateNetwork(): Promise<boolean> {
    try {
      const chainId = await this.getChainId();
      return chainId === this.config.chainId;
    } catch (error) {
      console.error('Error validating network:', error);
      return false;
    }
  }

  // Get blockchain stats for dashboard
  async getBlockchainStats() {
    try {
      const [currentBlock, gasPrice, chainId] = await Promise.all([
        this.getCurrentBlock(),
        this.getGasPrice(),
        this.getChainId()
      ]);

      return {
        currentBlockNumber: currentBlock.number,
        currentBlockHash: currentBlock.hash,
        gasPrice: this.weiToEther(gasPrice),
        chainId,
        networkName: this.config.networkName,
        timestamp: new Date(Number(currentBlock.timestamp) * 1000),
        transactionCount: currentBlock.transactions.length
      };
    } catch (error) {
      console.error('Error fetching blockchain stats:', error);
      throw new Error('Failed to fetch blockchain stats');
    }
  }
}

// Export singleton instance
export const alchemyService = new AlchemyBlockchainService();

// Export utility functions
export const blockchainUtils = {
  formatAddress: (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  formatTransactionHash: (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  },

  formatGasPrice: (gasPrice: bigint) => {
    const gasPriceInGwei = Number(gasPrice) / 1e9;
    return `${gasPriceInGwei.toFixed(2)} Gwei`;
  },

  calculateTransactionFee: (gasUsed: bigint, gasPrice: bigint) => {
    const feeInWei = gasUsed * gasPrice;
    return formatEther(feeInWei);
  },

  isTestnet: () => {
    return process.env.NEXT_PUBLIC_NETWORK !== 'mainnet';
  }
};

export default AlchemyBlockchainService;
