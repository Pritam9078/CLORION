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
import { useAuth } from "@/contexts/AuthContext";

// Use consistent mock user data

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEcosystem, setSelectedEcosystem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "credits" | "date">("price");
  const [cart, setCart] = useState<string[]>([]);
  
  // Mock data for marketplace credits
  const credits = [
    {
      id: "1",
      title: "Pacific Mangrove Restoration",
      description: "Restore 500 hectares of mangrove forest in the Philippines",
      ecosystem: "Mangrove",
      location: "Philippines",
      price: 25.50,
      totalCredits: 12500,
      availableCredits: 8200,
      verified: true,
      issueDate: "2024-01-15",
      expiryDate: "2034-01-15",
      seller: "Blue Carbon Initiative"
    },
    {
      id: "2", 
      title: "Indonesian Seagrass Conservation",
      description: "Protect and restore 300 hectares of seagrass beds",
      ecosystem: "Seagrass",
      location: "Indonesia",
      price: 32.00,
      totalCredits: 9500,
      availableCredits: 6800,
      verified: true,
      issueDate: "2024-02-10",
      expiryDate: "2034-02-10",
      seller: "Ocean Conservation Corp"
    },
    {
      id: "3",
      title: "Caribbean Salt Marsh Protection", 
      description: "Preserve 200 hectares of salt marsh ecosystem",
      ecosystem: "Salt Marsh",
      location: "Bahamas",
      price: 28.75,
      totalCredits: 6200,
      availableCredits: 4100,
      verified: true,
      issueDate: "2024-03-05",
      expiryDate: "2034-03-05",
      seller: "Caribbean Blue Network"
    }
  ];

  const ecosystems = ["Mangrove", "Seagrass", "Salt Marsh"];

  const filteredCredits = credits.filter(credit => {
    const matchesSearch = credit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credit.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEcosystem = !selectedEcosystem || credit.ecosystem === selectedEcosystem;
    return matchesSearch && matchesEcosystem;
  });

  const sortedCredits = [...filteredCredits].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "credits":
        return b.availableCredits - a.availableCredits;
      case "date":
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
      default:
        return 0;
    }
  });

  const addToCart = (creditId: string) => {
    setCart(prev => prev.includes(creditId) ? prev : [...prev, creditId]);
  };

  const removeFromCart = (creditId: string) => {
    setCart(prev => prev.filter(id => id !== creditId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header user={user} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Blue Carbon Marketplace
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Trade verified blue carbon credits from mangrove, seagrass, and salt marsh projects worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
            <div className="text-sm opacity-90">
              Cart: {cart.length} items
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search carbon credits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedEcosystem || ""}
                onChange={(e) => setSelectedEcosystem(e.target.value || null)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ecosystems</option>
                {ecosystems.map(ecosystem => (
                  <option key={ecosystem} value={ecosystem}>{ecosystem}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price" | "credits" | "date")}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="price">Sort by Price</option>
                <option value="credits">Sort by Credits</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedCredits.map((credit) => (
            <Card key={credit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="secondary" 
                    className={cn("px-3 py-1", getEcosystemColor(credit.ecosystem))}
                  >
                    {credit.ecosystem}
                  </Badge>
                  {credit.verified && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  {credit.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {credit.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {credit.location}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Issued: {formatDate(credit.issueDate)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Available Credits:</span>
                    <span className="font-medium">{formatNumber(credit.availableCredits)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Credits:</span>
                    <span className="font-medium">{formatNumber(credit.totalCredits)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(credit.availableCredits / credit.totalCredits) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(credit.price)}
                    </div>
                    <div className="text-sm text-gray-600">per credit</div>
                  </div>
                  
                  <div className="flex gap-2">
                    {cart.includes(credit.id) ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFromCart(credit.id)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => addToCart(credit.id)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedCredits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No carbon credits found matching your criteria.</div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedEcosystem(null);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatNumber(credits.reduce((sum, c) => sum + c.totalCredits, 0))}
              </div>
              <div className="text-gray-600">Total Credits Available</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(credits.reduce((sum, c) => sum + (c.price * c.availableCredits), 0))}
              </div>
              <div className="text-gray-600">Total Market Value</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {ecosystems.length}
              </div>
              <div className="text-gray-600">Ecosystem Types</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
