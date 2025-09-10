import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { alchemyService, blockchainUtils } from '@/lib/alchemy';
import { Activity, Zap, Hash, Clock, Users, DollarSign, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface BlockchainStats {
  currentBlockNumber: bigint | null;
  currentBlockHash: string | null;
  gasPrice: string;
  chainId: number;
  networkName: string;
  timestamp: Date;
  transactionCount: number;
}

interface BlockchainDashboardProps {
  className?: string;
}

export function BlockchainDashboard({ className }: BlockchainDashboardProps) {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBlockchainData = async () => {
    try {
      setError(null);
      const [blockchainStats, networkValid] = await Promise.all([
        alchemyService.getBlockchainStats(),
        alchemyService.validateNetwork()
      ]);
      
      setStats(blockchainStats);
      setIsConnected(networkValid);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching blockchain data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blockchain data');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchBlockchainData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchBlockchainData();
  };

  if (loading && !stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Blockchain Network Status
            </CardTitle>
            <CardDescription>Real-time blockchain network information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Blockchain Network Status
            </CardTitle>
            <CardDescription>Real-time blockchain network information</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={handleRefresh} className="mt-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Network Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Blockchain Network Status
                {isConnected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Real-time data from {stats?.networkName || 'Ethereum'} network via Alchemy
              </CardDescription>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Current Block
                </span>
              </div>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                #{stats?.currentBlockNumber?.toString() || '---'}
              </div>
              {stats?.currentBlockHash && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {blockchainUtils.formatTransactionHash(stats.currentBlockHash)}
                </div>
              )}
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Gas Price
                </span>
              </div>
              <div className="text-xl font-bold text-green-900 dark:text-green-100">
                {stats?.gasPrice ? `${parseFloat(stats.gasPrice).toFixed(6)} ETH` : '---'}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Network fee rate
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Transactions
                </span>
              </div>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {stats?.transactionCount || '---'}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                In current block
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Block Time
                </span>
              </div>
              <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                {stats?.timestamp ? stats.timestamp.toLocaleTimeString() : '---'}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {stats?.timestamp ? stats.timestamp.toLocaleDateString() : 'Block timestamp'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Network Details
          </CardTitle>
          <CardDescription>
            Detailed information about the connected blockchain network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Network Name
                </label>
                <p className="text-lg font-semibold">
                  {stats?.networkName || 'Unknown'}
                  {blockchainUtils.isTestnet() && (
                    <Badge variant="secondary" className="ml-2">Testnet</Badge>
                  )}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chain ID
                </label>
                <p className="text-lg font-semibold">{stats?.chainId || '---'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Connection Status
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Connected</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">Disconnected</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  RPC Provider
                </label>
                <p className="text-lg font-semibold">Alchemy</p>
                <p className="text-sm text-gray-500">Enhanced blockchain API</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Updated
                </label>
                <p className="text-lg font-semibold">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : '---'}
                </p>
                <p className="text-sm text-gray-500">
                  Auto-refresh every 30 seconds
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Carbon Credit Integration
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-600 font-medium">Ready for Tokenization</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
