import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Coins,
  Palette,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Lock,
  Unlock,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  RefreshCw,
  Activity
} from 'lucide-react';
import { CarbonCredit, EnhancedProject } from '@/types/enhanced';
import { useBlockchainData, useNetworkStats } from '@/hooks/useBlockchain';

interface NFTTokenizationSystemProps {
  project: EnhancedProject;
}

interface TokenizationStats {
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  floorPrice: number;
  volume24h: number;
  holders: number;
}

export const NFTTokenizationSystem: React.FC<NFTTokenizationSystemProps> = ({ project }) => {
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokenizationStats, setTokenizationStats] = useState<TokenizationStats>({
    totalSupply: 0,
    circulatingSupply: 0,
    marketCap: 0,
    floorPrice: 0,
    volume24h: 0,
    holders: 0
  });
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);

  // Blockchain integration hooks
  const { isConnected, gasPrice, chainId, formatAddress, error: blockchainError } = useBlockchainData();
  const { stats: networkStats } = useNetworkStats();

  useEffect(() => {
    // Load existing carbon credits
    setCarbonCredits(project.carbonCredits || mockCarbonCredits);
    
    // Calculate stats
    const credits = project.carbonCredits || mockCarbonCredits;
    const stats: TokenizationStats = {
      totalSupply: credits.length,
      circulatingSupply: credits.filter(c => !c.retirement).length,
      marketCap: credits.reduce((acc, c) => acc + c.quantity * 25, 0), // Assuming $25 per credit
      floorPrice: 25,
      volume24h: 15420,
      holders: new Set(credits.map(c => c.ownership.currentOwner)).size
    };
    setTokenizationStats(stats);
  }, [project]);

  const mintNewCredits = async () => {
    setLoading(true);
    
    // Simulate minting process
    setTimeout(() => {
      const newCredit: CarbonCredit = {
        tokenId: `CC-${Date.now()}`,
        projectId: project.id,
        creditType: 'BLUE_CARBON',
        vintage: new Date().getFullYear(),
        quantity: 100 + Math.floor(Math.random() * 400),
        methodology: 'VM0033 - Blue Carbon',
        verificationStandard: 'VCS',
        tokenStandard: 'ERC-1155',
        metadata: {
          serialNumber: `BC-${Date.now()}`,
          retirementEligible: true,
          additionalityProof: 'Additionality assessment completed',
          cobenefits: ['Biodiversity conservation', 'Community employment', 'Coastal protection'],
          sdgImpacts: [13, 14, 15, 8, 1] // Climate action, Life below water, Life on land, Decent work, No poverty
        },
        ownership: {
          currentOwner: '0x1234...5678',
          ownershipHistory: [
            {
              owner: '0x1234...5678',
              timestamp: new Date(),
              transactionHash: '0xabcd...efgh'
            }
          ]
        }
      };
      
      setCarbonCredits(prev => [newCredit, ...prev]);
      setLoading(false);
    }, 3000);
  };

  const getTokenStandardColor = (standard: string) => {
    switch (standard) {
      case 'ERC-721': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ERC-1155': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ERC-20': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCreditTypeColor = (type: string) => {
    switch (type) {
      case 'BLUE_CARBON': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'VCS': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CDM': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'GS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const CreditCard = ({ credit }: { credit: CarbonCredit }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => setSelectedCredit(credit)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-sm font-medium">
              Carbon Credit #{credit.tokenId.split('-')[1]}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCreditTypeColor(credit.creditType)}>
              {credit.creditType}
            </Badge>
            {credit.retirement && <Lock className="h-4 w-4 text-gray-500" />}
          </div>
        </div>
        <CardDescription>
          {credit.quantity} tCO2e • Vintage {credit.vintage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Token Standard</span>
            <Badge className={getTokenStandardColor(credit.tokenStandard)}>
              {credit.tokenStandard}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Value</span>
            <span className="font-medium">
              ${(credit.quantity * 25).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Owner</span>
            <span className="text-xs font-mono">
              {credit.ownership.currentOwner.slice(0, 6)}...{credit.ownership.currentOwner.slice(-4)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <div className="flex items-center gap-1">
              {credit.retirement ? (
                <>
                  <Lock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Retired</span>
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">Tradeable</span>
                </>
              )}
            </div>
          </div>

          {credit.metadata.cobenefits.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-1">Co-benefits:</p>
              <div className="flex flex-wrap gap-1">
                {credit.metadata.cobenefits.slice(0, 2).map((benefit, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
                {credit.metadata.cobenefits.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{credit.metadata.cobenefits.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CreditDetailView = ({ credit }: { credit: CarbonCredit }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Carbon Credit #{credit.tokenId.split('-')[1]}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy Token ID
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Token Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Token ID</span>
              <span className="text-sm font-mono">{credit.tokenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Standard</span>
              <Badge className={getTokenStandardColor(credit.tokenStandard)}>
                {credit.tokenStandard}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="text-sm font-medium">{credit.quantity} tCO2e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Vintage</span>
              <span className="text-sm font-medium">{credit.vintage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Credit Type</span>
              <Badge className={getCreditTypeColor(credit.creditType)}>
                {credit.creditType}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Verification & Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Methodology</span>
              <span className="text-sm font-medium">{credit.methodology}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Standard</span>
              <span className="text-sm font-medium">{credit.verificationStandard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Serial Number</span>
              <span className="text-sm font-mono">{credit.metadata.serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Retirement Eligible</span>
              <div className="flex items-center gap-1">
                {credit.metadata.retirementEligible ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-sm text-green-500">Yes</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-sm text-red-500">No</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Co-benefits & SDG Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Environmental & Social Co-benefits</h4>
              <div className="flex flex-wrap gap-2">
                {credit.metadata.cobenefits.map((benefit, idx) => (
                  <Badge key={idx} variant="outline">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">UN Sustainable Development Goals</h4>
              <div className="flex flex-wrap gap-2">
                {credit.metadata.sdgImpacts.map((sdg, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    SDG {sdg}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ownership History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {credit.ownership.ownershipHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-mono text-sm">
                    {entry.owner.slice(0, 8)}...{entry.owner.slice(-6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Tx
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {credit.retirement && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Retirement Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Retired By</span>
                <span className="text-sm font-mono">{credit.retirement.retiredBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Retirement Date</span>
                <span className="text-sm">{credit.retirement.retiredAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Beneficiary</span>
                <span className="text-sm">{credit.retirement.beneficiary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reason</span>
                <span className="text-sm">{credit.retirement.retirementReason}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const TokenizationOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p className="text-2xl font-bold">{tokenizationStats.totalSupply.toLocaleString()}</p>
              </div>
              <Coins className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">${tokenizationStats.marketCap.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">${tokenizationStats.volume24h.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tokenization Configuration</CardTitle>
            <CardDescription>
              Settings for carbon credit tokenization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tokenization Enabled</h4>
                <p className="text-sm text-muted-foreground">
                  {project.tokenization.enabled ? 'Active' : 'Inactive'}
                </p>
              </div>
              <Badge variant={project.tokenization.enabled ? "default" : "secondary"}>
                {project.tokenization.enabled ? 'ON' : 'OFF'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Token Standard</h4>
                <p className="text-sm text-muted-foreground">
                  {project.tokenization.tokenStandard}
                </p>
              </div>
              <Badge className={getTokenStandardColor(project.tokenization.tokenStandard)}>
                {project.tokenization.tokenStandard}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tokens Minted</h4>
                <p className="text-sm text-muted-foreground">
                  {project.tokenization.totalTokensMinted} total credits
                </p>
              </div>
              <span className="font-medium">
                {project.tokenization.totalTokensMinted.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Available for Sale</h4>
                <p className="text-sm text-muted-foreground">
                  Ready for marketplace
                </p>
              </div>
              <span className="font-medium">
                {project.tokenization.availableForSale.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Price per Token</h4>
                <p className="text-sm text-muted-foreground">
                  Current market price
                </p>
              </div>
              <span className="font-medium">
                ${project.tokenization.pricePerToken}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart Contract</CardTitle>
            <CardDescription>
              Blockchain deployment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.tokenization.smartContractAddress ? (
              <>
                <div>
                  <h4 className="font-medium mb-2">Contract Address</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {project.tokenization.smartContractAddress}
                    </span>
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Button>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4 mr-2" />
                    View on OpenSea
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-medium mb-2">No Contract Deployed</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Deploy a smart contract to enable tokenization
                </p>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Deploy Contract
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tokenization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">{carbonCredits.length}</p>
              </div>
              <Coins className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Floor Price</p>
                <p className="text-2xl font-bold">${tokenizationStats.floorPrice}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Holders</p>
                <p className="text-2xl font-bold">{tokenizationStats.holders}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retired</p>
                <p className="text-2xl font-bold">
                  {carbonCredits.filter(c => c.retirement).length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="credits" className="w-full">
        <TabsList>
          <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
          <TabsTrigger value="tokenization">Tokenization</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Carbon Credit NFTs</h3>
            <Button
              onClick={mintNewCredits}
              disabled={loading}
            >
              {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              <Sparkles className="h-4 w-4 mr-2" />
              Mint New Credits
            </Button>
          </div>

          {selectedCredit ? (
            <div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCredit(null)}
                className="mb-4"
              >
                ← Back to Credits
              </Button>
              <CreditDetailView credit={selectedCredit} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {carbonCredits.map(credit => (
                <CreditCard key={credit.tokenId} credit={credit} />
              ))}
            </div>
          )}

          {carbonCredits.length === 0 && !loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <Coins className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Carbon Credits Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Mint your first carbon credit NFTs to start trading
                </p>
                <Button onClick={mintNewCredits}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mint Credits
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tokenization">
          <TokenizationOverview />
        </TabsContent>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Integration</CardTitle>
              <CardDescription>
                Trading and marketplace settings for carbon credit NFTs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Marketplace Status</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={project.marketplace.listed ? "default" : "secondary"}>
                        {project.marketplace.listed ? 'Listed' : 'Not Listed'}
                      </Badge>
                      {project.marketplace.publiclyTradeable && (
                        <Badge variant="outline">Public Trading</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Trading Limits</h4>
                    <p className="text-sm text-muted-foreground">
                      Min: {project.marketplace.minimumPurchase} | Max: {project.marketplace.maximumPurchase}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Trading Fees</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.marketplace.tradingFees}% per transaction
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Liquidity Pool</h4>
                    <Badge variant={project.marketplace.liquidityPool ? "default" : "secondary"}>
                      {project.marketplace.liquidityPool ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Launch Marketplace
                  </Button>
                  <Button variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    List on OpenSea
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <p>Trading charts would be displayed here</p>
                    <p className="text-xs">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Price</span>
                    <span className="font-medium text-green-600">$25.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">7-day Change</span>
                    <span className="font-medium text-green-600">+5.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">30-day Change</span>
                    <span className="font-medium text-red-600">-2.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All-time High</span>
                    <span className="font-medium">$28.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">All-time Low</span>
                    <span className="font-medium">$18.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mock data for demonstration
const mockCarbonCredits: CarbonCredit[] = [
  {
    tokenId: 'CC-1704067200000',
    projectId: 'project-001',
    creditType: 'BLUE_CARBON',
    vintage: 2024,
    quantity: 250,
    methodology: 'VM0033 - Blue Carbon',
    verificationStandard: 'VCS',
    tokenStandard: 'ERC-1155',
    metadata: {
      serialNumber: 'BC-2024-001',
      retirementEligible: true,
      additionalityProof: 'Additionality assessment completed',
      cobenefits: ['Biodiversity conservation', 'Community employment', 'Coastal protection'],
      sdgImpacts: [13, 14, 15, 8, 1]
    },
    ownership: {
      currentOwner: '0x1234567890abcdef1234567890abcdef12345678',
      ownershipHistory: [
        {
          owner: '0x1234567890abcdef1234567890abcdef12345678',
          timestamp: new Date('2024-01-01'),
          transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
        }
      ]
    }
  },
  {
    tokenId: 'CC-1704153600000',
    projectId: 'project-001',
    creditType: 'VCS',
    vintage: 2024,
    quantity: 180,
    methodology: 'VM0033 - Blue Carbon',
    verificationStandard: 'VCS',
    tokenStandard: 'ERC-721',
    metadata: {
      serialNumber: 'VCS-2024-002',
      retirementEligible: true,
      additionalityProof: 'Baseline assessment verified',
      cobenefits: ['Marine ecosystem protection', 'Local economic development'],
      sdgImpacts: [13, 14, 8]
    },
    ownership: {
      currentOwner: '0x9876543210fedcba9876543210fedcba98765432',
      ownershipHistory: [
        {
          owner: '0x9876543210fedcba9876543210fedcba98765432',
          timestamp: new Date('2024-01-02'),
          transactionHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321fe'
        }
      ]
    },
    retirement: {
      retiredBy: '0x9876543210fedcba9876543210fedcba98765432',
      retiredAt: new Date('2024-01-15'),
      retirementReason: 'Corporate carbon neutrality offset',
      beneficiary: 'ABC Corporation'
    }
  }
];
