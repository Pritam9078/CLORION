"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { RouteProtection } from "@/components/RouteProtection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  Leaf, 
  Shield, 
  MapPin, 
  Calendar, 
  Star,
  TrendingUp,
  ChevronDown,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Building,
  Globe,
  Zap,
  Award
} from "lucide-react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";

// Mock data for available carbon credits
const mockAvailableCredits = [
  {
    id: "credits_001",
    projectName: "Sundarbans Mangrove Conservation",
    provider: "Bangladesh Forest Department",
    location: "Khulna, Bangladesh",
    ecosystemType: "MANGROVE",
    certificationStandard: "VCS + CCB",
    pricePerCredit: 42.50,
    availableCredits: 15000,
    vintage: "2024",
    verifiedBy: "TÜV SÜD",
    projectImage: "/project-images/sundarbans.jpg",
    description: "Large-scale mangrove restoration project protecting 2,500 hectares of critical coastal habitat.",
    additionalBenefits: ["Biodiversity conservation", "Storm protection", "Local employment"],
    rating: 4.8,
    carbonOffset: "1 credit = 1 tCO2e"
  },
  {
    id: "credits_002", 
    projectName: "Seychelles Seagrass Restoration",
    provider: "Seychelles Conservation Foundation",
    location: "Mahé, Seychelles",
    ecosystemType: "SEAGRASS",
    certificationStandard: "Gold Standard",
    pricePerCredit: 38.90,
    availableCredits: 8500,
    vintage: "2023",
    verifiedBy: "SCS Global",
    projectImage: "/project-images/seychelles.jpg",
    description: "Innovative seagrass meadow restoration supporting marine biodiversity and carbon sequestration.",
    additionalBenefits: ["Marine habitat restoration", "Fish nursery protection", "Tourism benefits"],
    rating: 4.6,
    carbonOffset: "1 credit = 1 tCO2e"
  },
  {
    id: "credits_003",
    projectName: "California Salt Marsh Recovery",
    provider: "San Francisco Bay Restoration Authority", 
    location: "San Francisco Bay, USA",
    ecosystemType: "SALT_MARSH",
    certificationStandard: "VCS + CAR",
    pricePerCredit: 55.75,
    availableCredits: 5200,
    vintage: "2024",
    verifiedBy: "Environmental Services Inc.",
    projectImage: "/project-images/california-marsh.jpg",
    description: "Comprehensive salt marsh restoration enhancing climate resilience and carbon storage.",
    additionalBenefits: ["Flood protection", "Wildlife habitat", "Water quality improvement"],
    rating: 4.9,
    carbonOffset: "1 credit = 1 tCO2e"
  },
  {
    id: "credits_004",
    projectName: "Great Barrier Reef Blue Carbon",
    provider: "Australian Marine Conservation Society",
    location: "Queensland, Australia",
    ecosystemType: "SEAGRASS",
    certificationStandard: "ACCUs",
    pricePerCredit: 47.20,
    availableCredits: 12000,
    vintage: "2024",
    verifiedBy: "Det Norske Veritas",
    projectImage: "/project-images/barrier-reef.jpg",
    description: "Seagrass restoration supporting coral reef ecosystem health and carbon capture.",
    additionalBenefits: ["Coral reef support", "Tourism enhancement", "Research opportunities"],
    rating: 4.7,
    carbonOffset: "1 credit = 1 tCO2e"
  },
  {
    id: "credits_005",
    projectName: "Madagascar Mangrove Alliance",
    provider: "WCS Madagascar",
    location: "Mahajanga, Madagascar",
    ecosystemType: "MANGROVE",
    certificationStandard: "VCS + CCBS",
    pricePerCredit: 35.60,
    availableCredits: 18000,
    vintage: "2023",
    verifiedBy: "Preferred by Nature",
    projectImage: "/project-images/madagascar.jpg",
    description: "Community-based mangrove conservation protecting critical habitat and supporting livelihoods.",
    additionalBenefits: ["Community development", "Fisheries protection", "Ecotourism"],
    rating: 4.5,
    carbonOffset: "1 credit = 1 tCO2e"
  }
];

// Mock user purchase history
const mockPurchaseHistory = [
  {
    id: "purchase_001",
    projectName: "Sundarbans Mangrove Conservation",
    credits: 500,
    pricePerCredit: 42.50,
    totalAmount: 21250,
    purchaseDate: "2024-03-15",
    status: "COMPLETED",
    transactionId: "TXN_ABC123",
    receiptUrl: "/receipts/receipt_001.pdf"
  },
  {
    id: "purchase_002",
    projectName: "Seychelles Seagrass Restoration", 
    credits: 250,
    pricePerCredit: 38.90,
    totalAmount: 9725,
    purchaseDate: "2024-03-10",
    status: "COMPLETED",
    transactionId: "TXN_DEF456",
    receiptUrl: "/receipts/receipt_002.pdf"
  }
];

export default function BuyCreditsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [availableCredits] = useState(mockAvailableCredits);
  const [purchaseHistory] = useState(mockPurchaseHistory);
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [ecosystemFilter, setEcosystemFilter] = useState("ALL");
  const [priceSort, setPriceSort] = useState("ASC");
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CRYPTO" | "FIAT">("FIAT");
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(2750); // Mock current credit balance

  // Filter and sort credits
  const filteredCredits = availableCredits
    .filter(credit => {
      const matchesSearch = credit.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          credit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          credit.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEcosystem = ecosystemFilter === "ALL" || credit.ecosystemType === ecosystemFilter;
      return matchesSearch && matchesEcosystem;
    })
    .sort((a, b) => {
      if (priceSort === "ASC") return a.pricePerCredit - b.pricePerCredit;
      return b.pricePerCredit - a.pricePerCredit;
    });

  // Calculate cart totals
  const cartTotalCredits = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotalAmount = Object.entries(cart).reduce((sum, [creditId, qty]) => {
    const credit = availableCredits.find(c => c.id === creditId);
    return sum + (credit ? credit.pricePerCredit * qty : 0);
  }, 0);

  // Add to cart
  const addToCart = (creditId: string) => {
    setCart(prev => ({
      ...prev,
      [creditId]: (prev[creditId] || 0) + 1
    }));
  };

  // Remove from cart
  const removeFromCart = (creditId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[creditId] > 1) {
        newCart[creditId]--;
      } else {
        delete newCart[creditId];
      }
      return newCart;
    });
  };

  // Update cart quantity
  const updateCartQuantity = (creditId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => {
        const newCart = { ...prev };
        delete newCart[creditId];
        return newCart;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [creditId]: quantity
      }));
    }
  };

  // Ecosystem type colors
  const getEcosystemColor = (ecosystem: string) => {
    switch (ecosystem) {
      case "MANGROVE": return "bg-green-100 text-green-800 border-green-200";
      case "SEAGRASS": return "bg-blue-100 text-blue-800 border-blue-200";
      case "SALT_MARSH": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartTotalCredits === 0) return;
    setShowCheckout(true);
  };

  // Process purchase
  const processPurchase = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update balance
    setCurrentBalance(prev => prev + cartTotalCredits);
    
    // Clear cart
    setCart({});
    setShowCheckout(false);
    setShowPurchaseSuccess(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => setShowPurchaseSuccess(false), 5000);
  };

  return (
    <RouteProtection allowedRoles={["PROJECT_OWNER"]} redirectTo="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          {showPurchaseSuccess && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">Purchase Successful!</h3>
                <p className="text-green-700">Your carbon credits have been added to your portfolio.</p>
              </div>
            </div>
          )}

          {/* Page Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-h2 mb-2">Buy Carbon Credits</h1>
              <p className="text-body max-w-2xl">
                Purchase verified blue carbon credits to offset your emissions or support environmental projects.
              </p>
            </div>
            
            {/* Current Balance */}
            <Card className="min-w-[200px]">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(currentBalance)}</div>
                  <div className="text-sm text-gray-600">Credits in Portfolio</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search projects, locations, or providers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Ecosystem Filter */}
                <div className="relative">
                  <select
                    value={ecosystemFilter}
                    onChange={(e) => setEcosystemFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ALL">All Ecosystems</option>
                    <option value="MANGROVE">Mangrove</option>
                    <option value="SEAGRASS">Seagrass</option>
                    <option value="SALT_MARSH">Salt Marsh</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Price Sort */}
                <div className="relative">
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ASC">Price: Low to High</option>
                    <option value="DESC">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Credits Listing */}
            <div className="lg:col-span-2 space-y-6">
              {filteredCredits.map((credit) => (
                <Card key={credit.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Project Image */}
                      <div className="md:w-48 h-32 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-green-600" />
                      </div>

                      {/* Project Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between mb-3">
                          <div>
                            <h3 className="text-h4 mb-2">{credit.projectName}</h3>
                            <p className="text-body-small text-gray-600 mb-2">{credit.provider}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-body-small text-gray-600">{credit.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-h3 text-blue-600 font-bold">
                              {formatCurrency(credit.pricePerCredit)}
                            </div>
                            <div className="text-body-small text-gray-600">per credit</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getEcosystemColor(credit.ecosystemType)}>
                            {credit.ecosystemType.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                            {credit.certificationStandard}
                          </Badge>
                          <Badge variant="outline">
                            Vintage {credit.vintage}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-body-small">{credit.rating}</span>
                          </div>
                        </div>

                        <p className="text-body-small text-gray-700 mb-4">{credit.description}</p>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                          <div className="text-body-small">
                            <div className="text-gray-600">
                              <strong>Available:</strong> {formatNumber(credit.availableCredits)} credits
                            </div>
                            <div className="text-gray-600">
                              <strong>Verified by:</strong> {credit.verifiedBy}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {cart[credit.id] ? (
                              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(credit.id)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold">{cart[credit.id]}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => addToCart(credit.id)}
                                  className="w-8 h-8 p-0"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => addToCart(credit.id)}
                                className="flex items-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCredits.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-h4 mb-2">No credits found</h3>
                    <p className="text-body text-gray-600">Try adjusting your search criteria or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Shopping Cart Sidebar */}
            <div className="space-y-6">
              {/* Cart Summary */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.keys(cart).length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-body text-gray-600">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      {Object.entries(cart).map(([creditId, quantity]) => {
                        const credit = availableCredits.find(c => c.id === creditId);
                        if (!credit) return null;
                        
                        return (
                          <div key={creditId} className="border-b border-gray-200 pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-medium">{credit.projectName}</h4>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateCartQuantity(creditId, 0)}
                                className="w-6 h-6 p-0 text-gray-400 hover:text-red-600"
                              >
                                ×
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-gray-50 rounded p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(creditId)}
                                  className="w-6 h-6 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => updateCartQuantity(creditId, parseInt(e.target.value) || 0)}
                                  className="w-12 text-center text-sm bg-transparent border-0 p-0"
                                  min="0"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => addToCart(creditId)}
                                  className="w-6 h-6 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-sm font-semibold">
                                {formatCurrency(credit.pricePerCredit * quantity)}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Total Credits:</span>
                          <span className="font-semibold">{formatNumber(cartTotalCredits)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Total Amount:</span>
                          <span className="text-lg font-bold text-blue-600">
                            {formatCurrency(cartTotalAmount)}
                          </span>
                        </div>
                        <Button 
                          onClick={handleCheckout}
                          className="w-full"
                          disabled={cartTotalCredits === 0}
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Purchases */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">Purchase History</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push('/project-owner/purchase-history')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {purchaseHistory.length === 0 ? (
                    <p className="text-body-small text-gray-600 text-center py-4">No purchases yet</p>
                  ) : (
                    <div className="space-y-3">
                      {purchaseHistory.slice(0, 3).map((purchase) => (
                        <div key={purchase.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">{purchase.projectName}</div>
                          <div className="flex justify-between text-body-small text-gray-600">
                            <span>{formatNumber(purchase.credits)} credits</span>
                            <span>{formatCurrency(purchase.totalAmount)}</span>
                          </div>
                          <div className="text-body-small text-gray-500">
                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Complete Your Purchase</CardTitle>
                <CardDescription>
                  Review your order and select payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  {Object.entries(cart).map(([creditId, quantity]) => {
                    const credit = availableCredits.find(c => c.id === creditId);
                    if (!credit) return null;
                    
                    return (
                      <div key={creditId} className="flex justify-between text-sm mb-2">
                        <span>{credit.projectName} × {quantity}</span>
                        <span>{formatCurrency(credit.pricePerCredit * quantity)}</span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total: {formatNumber(cartTotalCredits)} credits</span>
                      <span>{formatCurrency(cartTotalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-medium mb-3">Payment Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="FIAT"
                        checked={paymentMethod === "FIAT"}
                        onChange={(e) => setPaymentMethod(e.target.value as "FIAT")}
                        className="mr-3"
                      />
                      <CreditCard className="w-5 h-5 mr-2" />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="CRYPTO"
                        checked={paymentMethod === "CRYPTO"}
                        onChange={(e) => setPaymentMethod(e.target.value as "CRYPTO")}
                        className="mr-3"
                      />
                      <Wallet className="w-5 h-5 mr-2" />
                      <span>Crypto Wallet</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={processPurchase} className="flex-1">
                    Complete Purchase
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </RouteProtection>
  );
}
