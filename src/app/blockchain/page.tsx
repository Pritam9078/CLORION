"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { BlockchainDashboard } from "@/components/blockchain/BlockchainDashboard";
import { WalletIntegration } from "@/components/wallet/WalletIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Wallet, BarChart3, Zap, Globe, Code } from "lucide-react";

export default function BlockchainPage() {
  const [activeTab, setActiveTab] = useState("network");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Blockchain Integration
            </h1>
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Powered by Alchemy
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time blockchain data, wallet management, and carbon credit tokenization on Ethereum Sepolia testnet
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="network" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Network Status
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Code className="h-4 w-4 mr-2" />
              API Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="space-y-6 min-h-[500px]">
            <BlockchainDashboard />
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6 min-h-[500px]">
            <WalletIntegration />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Gas Price Trends
                  </CardTitle>
                  <CardDescription>
                    Historical gas price data from Alchemy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p>Gas price chart would be displayed here</p>
                      <p className="text-sm">Using Alchemy's enhanced gas API</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Transaction Volume
                  </CardTitle>
                  <CardDescription>
                    Network transaction activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2" />
                      <p>Transaction volume chart would be displayed here</p>
                      <p className="text-sm">Real-time data from Alchemy WebSocket</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Carbon Credit Markets
                  </CardTitle>
                  <CardDescription>
                    Tokenized carbon credit trading data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2" />
                      <p>Carbon credit market data would be displayed here</p>
                      <p className="text-sm">NFT and DeFi integration analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Performance</CardTitle>
                  <CardDescription>
                    Blockchain network health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Block Time</span>
                      <span className="text-sm">~12 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Network Hash Rate</span>
                      <span className="text-sm">Stable</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Pending Transactions</span>
                      <span className="text-sm">Normal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Node Sync Status</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Synced
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6 min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alchemy API Integration</CardTitle>
                  <CardDescription>
                    Current API configuration and usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        API Endpoint
                      </label>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm">
                        https://eth-sepolia.g.alchemy.com/v2/***
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Network
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Ethereum Sepolia</Badge>
                        <Badge variant="outline">Testnet</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Integration Status
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Features Enabled
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="default">Enhanced APIs</Badge>
                        <Badge variant="default">WebSocket</Badge>
                        <Badge variant="default">NFT API</Badge>
                        <Badge variant="default">Trace API</Badge>
                        <Badge variant="default">Mempool</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Usage Statistics</CardTitle>
                  <CardDescription>
                    Request metrics and performance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Requests Today</span>
                      <span className="text-sm font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Average Response Time</span>
                      <span className="text-sm font-bold">89ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-bold text-green-600">99.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">WebSocket Connections</span>
                      <span className="text-sm font-bold">3 Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available API Methods</CardTitle>
                  <CardDescription>
                    Alchemy API methods integrated in CLORION
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'eth_getBalance',
                      'eth_getBlock',
                      'eth_getTransaction',
                      'eth_getTransactionReceipt',
                      'eth_gasPrice',
                      'eth_estimateGas',
                      'eth_getChainId',
                      'alchemy_getTokenBalances',
                      'alchemy_getTokenMetadata',
                      'alchemy_getNfts'
                    ].map((method, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono">
                        {method}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Features</CardTitle>
                  <CardDescription>
                    Live blockchain data integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Block Monitoring</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Gas Price Tracking</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">NFT Transfer Events</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Carbon Credit Minting</span>
                      <Badge variant="secondary">
                        Ready
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
