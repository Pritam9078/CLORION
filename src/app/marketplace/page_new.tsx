"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Shield, 
  Search,
  Filter,
  SortAsc,
  Info,
  Wallet,
  Zap,
  Activity,
  Link
} from "lucide-react";
import { cn, formatNumber, formatCurrency, formatDate, getEcosystemColor } from "@/lib/utils";
import { useBlockchainData, useWalletBalance } from "@/hooks/useBlockchain";
import { carbonCreditContract } from "@/lib/carbonCreditContract";

// Mock user data
const mockUser = {
  name: "Jane Smith",
  email: "jane.smith@trader.com", 
  role: "TRADER" as "PROJECT_OWNER" | "TRADER" | "VERIFIER" | "ADMIN",
  walletAddress: "0x742d35Cc6634C0532925a3b8D1B1C93C7aAf3b"
};

// Mock marketplace listings
const mockListings = [
  {
    id: "1",
    projectId: "1",
    projectName: "Sundarbans Mangrove Restoration",
    location: "Bangladesh",
    ecosystemType: "MANGROVE",
    vintage: 2024,
    creditsAvailable: 2500,
    pricePerCredit: 32.50,
    totalValue: 81250,
    seller: "Green Earth Foundation",
    verificationDate: "2024-02-15",
    co2PerCredit: 1,
    projectArea: 1250,
    certificationStandard: "Verra VCS",
    expiryDate: "2034-02-15",
    features: ["Biodiversity co-benefits", "Community involvement", "Satellite verified"]
  },
  {
    id: "2",
    projectId: "2", 
    projectName: "Coastal Seagrass Protection",
    location: "Philippines",
    ecosystemType: "SEAGRASS",
    vintage: 2024,
    creditsAvailable: 1875,
    pricePerCredit: 24.60,
    totalValue: 46125,
    seller: "Ocean Conservation Australia", 
    verificationDate: "2024-02-28",
    co2PerCredit: 1,
    projectArea: 950,
    certificationStandard: "Verra VCS",
    expiryDate: "2034-02-28",
    features: ["Marine biodiversity", "Erosion control", "Research partnership"]
  }
];

export default function MarketplacePage() {
  const [user] = useState(mockUser);
  const [listings] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [ecosystemFilter, setEcosystemFilter] = useState("ALL");
  const [priceSort, setPriceSort] = useState("asc");
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  // Blockchain integration with Alchemy
  const { 
    isConnected, 
    gasPrice, 
    currentBlock,
    formatAddress 
  } = useBlockchainData();
  
  const { 
    balance: ethBalance, 
    loading: balanceLoading 
  } = useWalletBalance(user.walletAddress);

  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEcosystem = ecosystemFilter === "ALL" || listing.ecosystemType === ecosystemFilter;
      return matchesSearch && matchesEcosystem;
    })
    .sort((a, b) => {
      if (priceSort === "asc") return a.pricePerCredit - b.pricePerCredit;
      return b.pricePerCredit - a.pricePerCredit;
    });

  const handlePurchase = async (listing: any) => {
    if (!isConnected) {
      alert("Please connect to blockchain network first");
      return;
    }
    setSelectedListing(listing);
    setPurchaseQuantity(1);
  };

  const confirmPurchase = async () => {
    try {
      // Use Alchemy-powered blockchain transaction
      const txHash = await carbonCreditContract.transferCarbonCredit({
        tokenId: selectedListing.id,
        from: selectedListing.seller,
        to: user.walletAddress,
        amount: purchaseQuantity
      });
      
      console.log("Purchase transaction:", txHash);
      setSelectedListing(null);
      alert(`Purchase successful! Transaction: ${txHash.slice(0, 10)}...`);
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  const totalMarketValue = listings.reduce((sum, listing) => sum + listing.totalValue, 0);
  const totalCreditsAvailable = listings.reduce((sum, listing) => sum + listing.creditsAvailable, 0);
  const averagePrice = listings.reduce((sum, listing) => sum + listing.pricePerCredit, 0) / listings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carbon Credit Marketplace
          </h1>
          <p className="text-gray-600">
            Trade verified blue carbon credits powered by Alchemy blockchain technology
          </p>
        </div>

        {/* Market Stats with Alchemy Integration */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Market Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalMarketValue)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credits Available</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(totalCreditsAvailable)}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Your ETH Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {balanceLoading ? "..." : ethBalance ? `${parseFloat(ethBalance).toFixed(4)}` : "0.0000"}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gas Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gasPrice ? `${parseFloat(gasPrice).toFixed(6)}` : "..."}
                  </p>
                  <p className="text-xs text-gray-500">ETH</p>
                </div>
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Network Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isConnected ? "Connected" : "Offline"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentBlock ? `Block #${currentBlock.number?.toString().slice(-4)}` : ""}
                  </p>
                </div>
                <Link className={`w-8 h-8 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Ecosystem Filter */}
              <select
                value={ecosystemFilter}
                onChange={(e) => setEcosystemFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Ecosystems</option>
                <option value="MANGROVE">Mangrove</option>
                <option value="SEAGRASS">Seagrass</option>
                <option value="SALT_MARSH">Salt Marsh</option>
              </select>
              
              {/* Price Sort */}
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{listing.projectName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {listing.location}
                      <Badge className={getEcosystemColor(listing.ecosystemType)}>
                        {listing.ecosystemType.replace('_', ' ')}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(listing.pricePerCredit)}
                    </div>
                    <div className="text-sm text-gray-500">per credit</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Credits Available:</span>
                      <div className="font-semibold">{formatNumber(listing.creditsAvailable)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Vintage:</span>
                      <div className="font-semibold">{listing.vintage}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Project Area:</span>
                      <div className="font-semibold">{formatNumber(listing.projectArea)} hectares</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Standard:</span>
                      <div className="font-semibold">{listing.certificationStandard}</div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Key Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {listing.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Purchase Button */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Total Value: <span className="font-semibold text-gray-900">{formatCurrency(listing.totalValue)}</span>
                    </div>
                    <Button 
                      onClick={() => handlePurchase(listing)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!isConnected}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isConnected ? "Purchase" : "Connect Wallet"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No carbon credits found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or check back later for new listings.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* Purchase Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Purchase Carbon Credits</CardTitle>
              <CardDescription>
                {selectedListing.projectName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedListing.creditsAvailable}
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Price per credit:</span>
                    <span>{formatCurrency(selectedListing.pricePerCredit)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Quantity:</span>
                    <span>{purchaseQuantity}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedListing.pricePerCredit * purchaseQuantity)}</span>
                  </div>
                  
                  {gasPrice && (
                    <div className="mt-2 text-sm text-gray-600">
                      Estimated gas fee: {parseFloat(gasPrice).toFixed(6)} ETH
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedListing(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmPurchase}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirm Purchase
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
