import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWalletBalance, useBlockchainData } from '@/hooks/useBlockchain';
import { carbonCreditContract, carbonCreditUtils } from '@/lib/carbonCreditContract';
import { Wallet, Coins, Send, History, ArrowUpRight, ArrowDownRight, ExternalLink, Copy, RefreshCw } from 'lucide-react';

interface WalletIntegrationProps {
  address?: string;
  className?: string;
}

export function WalletIntegration({ address, className }: WalletIntegrationProps) {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(address || null);
  const [carbonCredits, setCarbonCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { balance, loading: balanceLoading, refreshBalance } = useWalletBalance(connectedAddress || undefined);
  const { formatAddress, isConnected, chainId, networkName } = useBlockchainData();

  useEffect(() => {
    if (connectedAddress) {
      fetchCarbonCredits();
    }
  }, [connectedAddress]);

  const fetchCarbonCredits = async () => {
    if (!connectedAddress) return;

    try {
      setLoading(true);
      setError(null);
      const credits = await carbonCreditContract.getAllBalances(connectedAddress);
      setCarbonCredits(credits);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch carbon credits';
      setError(errorMessage);
      console.error('Error fetching carbon credits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    // Simulate wallet connection - in real app, this would integrate with wallet provider
    const mockAddress = '0x742d35Cc6634C0532925a3b8D1B1C93C7aAf3b';
    setConnectedAddress(mockAddress);
  };

  const handleDisconnectWallet = () => {
    setConnectedAddress(null);
    setCarbonCredits([]);
  };

  const copyAddress = async () => {
    if (connectedAddress) {
      try {
        await navigator.clipboard.writeText(connectedAddress);
        // You could show a toast notification here
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  if (!connectedAddress) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
            <CardDescription>
              Connect your wallet to view carbon credits and blockchain transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No wallet connected</p>
              <Button onClick={handleConnectWallet} className="bg-blue-600 hover:bg-blue-700">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Wallet Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Connected Wallet
                {isConnected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Disconnected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Manage your carbon credits and blockchain transactions
              </CardDescription>
            </div>
            <Button onClick={handleDisconnectWallet} variant="outline" size="sm">
              Disconnect
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {formatAddress(connectedAddress)}
                </span>
                <Button onClick={copyAddress} variant="outline" size="sm">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ETH Balance
              </label>
              <div className="flex items-center gap-2">
                {balanceLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <span className="font-semibold">
                    {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </span>
                )}
                <Button onClick={refreshBalance} variant="outline" size="sm" disabled={balanceLoading}>
                  <RefreshCw className={`h-3 w-3 ${balanceLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Network
              </label>
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">{networkName}</span>
                <Badge variant="secondary">Chain ID: {chainId}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Carbon Credits
              </label>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{carbonCredits.length} tokens</span>
                <Button onClick={fetchCarbonCredits} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carbon Credits Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Carbon Credits Portfolio
          </CardTitle>
          <CardDescription>
            Your tokenized carbon credits on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : carbonCredits.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No carbon credits found</p>
              <p className="text-sm text-gray-500">Purchase or mint carbon credits to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {carbonCredits.map((credit, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{credit.metadata?.name || `Token #${credit.tokenId}`}</h4>
                      <p className="text-sm text-gray-600">{credit.metadata?.description || 'Carbon Credit Token'}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{carbonCreditUtils.formatCarbonAmount(credit.balance)}</div>
                      <div className="text-sm text-gray-500">Balance</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {credit.metadata?.attributes?.map((attr: any, attrIndex: number) => (
                      <Badge key={attrIndex} variant="secondary" className="text-xs">
                        {attr.trait_type}: {attr.value}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Send className="h-3 w-3 mr-1" />
                      Transfer
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="h-3 w-3 mr-1" />
                      Retire
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common blockchain operations for carbon credit management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center gap-2">
              <Coins className="h-6 w-6" />
              <span>Buy Carbon Credits</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Send className="h-6 w-6" />
              <span>Transfer Credits</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <History className="h-6 w-6" />
              <span>Retire Credits</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Your latest blockchain transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Mock transactions */}
            {[
              { type: 'Received', amount: '50 tCO₂e', from: '0x123...abc', time: '2 hours ago', status: 'confirmed' },
              { type: 'Purchased', amount: '100 tCO₂e', from: 'Marketplace', time: '1 day ago', status: 'confirmed' },
              { type: 'Retired', amount: '25 tCO₂e', from: 'Self', time: '3 days ago', status: 'confirmed' }
            ].map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {tx.type === 'Received' ? (
                    <ArrowDownRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="font-medium">{tx.type} {tx.amount}</div>
                    <div className="text-sm text-gray-500">From: {tx.from}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{tx.time}</div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
