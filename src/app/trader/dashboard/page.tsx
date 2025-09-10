"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  BarChart3, 
  Wallet,
  Download,
  Eye,
  ShoppingCart,
  Target,
  Globe,
  Activity,
  Users,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Calendar,
  MapPin,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { RouteProtection } from "@/components/RouteProtection";

// Mock trader portfolio data
const mockPortfolioData = {
  totalCredits: 12500,
  activeCredits: 9800,
  retiredCredits: 2700,
  portfolioValue: 405000, // USD
  totalInvestment: 320000,
  unrealizedGains: 85000,
  realizedGains: 15500,
  averagePurchasePrice: 25.60,
  currentAveragePrice: 32.40,
  portfolioGrowth: 26.5 // percentage
};

const mockHoldings = [
  {
    id: "1",
    projectName: "Sundarbans Mangrove Restoration",
    location: "Bangladesh",
    ecosystemType: "MANGROVE",
    creditsOwned: 3500,
    averagePrice: 28.50,
    currentPrice: 35.20,
    totalValue: 123200,
    unrealizedGain: 23450,
    purchaseDate: "2024-01-15",
    vintage: 2024
  },
  {
    id: "2", 
    projectName: "Coastal Seagrass Protection",
    location: "Philippines",
    ecosystemType: "SEAGRASS",
    creditsOwned: 2800,
    averagePrice: 22.30,
    currentPrice: 28.60,
    totalValue: 80080,
    unrealizedGain: 17640,
    purchaseDate: "2024-02-03",
    vintage: 2024
  },
  {
    id: "3",
    projectName: "Salt Marsh Conservation",
    location: "Netherlands",
    ecosystemType: "SALT_MARSH", 
    creditsOwned: 4200,
    averagePrice: 24.80,
    currentPrice: 31.10,
    totalValue: 130620,
    unrealizedGain: 26460,
    purchaseDate: "2024-01-28",
    vintage: 2024
  }
];

const mockTransactions = [
  {
    id: "tx_001",
    type: "BUY",
    projectName: "Australian Blue Carbon Project",
    credits: 1500,
    pricePerCredit: 33.20,
    totalAmount: 49800,
    date: "2024-03-10",
    status: "COMPLETED"
  },
  {
    id: "tx_002", 
    type: "SELL",
    projectName: "Sundarbans Mangrove Restoration",
    credits: 800,
    pricePerCredit: 36.50,
    totalAmount: 29200,
    date: "2024-03-08", 
    status: "COMPLETED"
  },
  {
    id: "tx_003",
    type: "RETIRE",
    projectName: "Coastal Seagrass Protection",
    credits: 500,
    pricePerCredit: 28.60,
    totalAmount: 14300,
    date: "2024-03-05",
    status: "RETIRED"
  }
];

export default function TraderDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("portfolio");
  const [timeRange, setTimeRange] = useState("1M");

  // Redirect non-traders
  useEffect(() => {
    if (user && user.role !== "TRADER") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number, showSign: boolean = true) => {
    const sign = showSign && num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  const getEcosystemColor = (ecosystem: string) => {
    switch (ecosystem) {
      case "MANGROVE": return "bg-green-100 text-green-800";
      case "SEAGRASS": return "bg-blue-100 text-blue-800";
      case "SALT_MARSH": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RouteProtection allowedRoles={["TRADER"]} redirectTo="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
                        <h1 className="text-h2 mb-2">
              Welcome to your Trader Dashboard, {user?.name}!
            </h1>
            <p className="text-body">
              Manage your carbon credit portfolio and explore trading opportunities.
            </p>
          </div>

          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockPortfolioData.portfolioValue)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">{formatPercentage(mockPortfolioData.portfolioGrowth)}</span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Credits</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(mockPortfolioData.totalCredits)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">
                    {formatNumber(mockPortfolioData.activeCredits)} active • {formatNumber(mockPortfolioData.retiredCredits)} retired
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unrealized Gains</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(mockPortfolioData.unrealizedGains)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-50">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">
                    Avg buy: ${mockPortfolioData.averagePurchasePrice} • Current: ${mockPortfolioData.currentAveragePrice}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Climate Impact</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(mockPortfolioData.totalCredits)} t</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">CO₂ equivalent offset</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Holdings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Your Holdings
                    </CardTitle>
                    <CardDescription>
                      Current carbon credit positions in your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockHoldings.map((holding) => (
                        <div key={holding.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{holding.projectName}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {holding.location}
                                <Badge className={getEcosystemColor(holding.ecosystemType)} variant="secondary">
                                  {holding.ecosystemType}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Credits Owned:</span>
                              <div className="font-semibold">{formatNumber(holding.creditsOwned)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Current Value:</span>
                              <div className="font-semibold">{formatCurrency(holding.totalValue)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Avg Price:</span>
                              <div className="font-semibold">${holding.averagePrice}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Unrealized Gain:</span>
                              <div className="font-semibold text-green-600">+{formatCurrency(holding.unrealizedGain)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>
                      Your latest trading activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransactions.map((tx) => (
                        <div key={tx.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={
                                tx.type === 'BUY' ? 'bg-blue-100 text-blue-800' :
                                tx.type === 'SELL' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }>
                                {tx.type}
                              </Badge>
                              <span className="font-medium">{tx.projectName}</span>
                            </div>
                            <Badge variant={tx.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {tx.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Credits:</span>
                              <div className="font-semibold">{formatNumber(tx.credits)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Price:</span>
                              <div className="font-semibold">${tx.pricePerCredit}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Total:</span>
                              <div className="font-semibold">{formatCurrency(tx.totalAmount)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Marketplace Tab */}
            <TabsContent value="marketplace" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Browse Marketplace
                  </CardTitle>
                  <CardDescription>
                    Discover and purchase verified carbon credits
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Marketplace Integration</h3>
                  <p className="text-gray-600 mb-6">Browse available carbon credits and make purchases directly from your trader dashboard.</p>
                  <Button onClick={() => router.push('/marketplace')}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Go to Marketplace
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Portfolio Analytics
                  </CardTitle>
                  <CardDescription>
                    Advanced analytics and market insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 mb-6">Track your portfolio performance, analyze market trends, and get AI-powered insights.</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push('/analytics')}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Market Trends
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    ESG Reports & Compliance
                  </CardTitle>
                  <CardDescription>
                    Generate reports for compliance and sustainability reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Available Reports</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Portfolio Summary", description: "Complete overview of your carbon credit holdings" },
                          { name: "Impact Report", description: "Environmental impact and CO₂ offset calculations" },
                          { name: "Trading Activity", description: "Complete transaction history and performance" },
                          { name: "ESG Compliance", description: "Sustainability reporting for corporate compliance" }
                        ].map((report, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium mb-1">{report.name}</h5>
                            <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Generate
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Retirement Certificates</h4>
                      <p className="text-blue-800 text-sm mb-4">
                        Automatically receive verifiable retirement certificates when you retire carbon credits for compliance or CSR purposes.
                      </p>
                      <Button variant="outline" size="sm">
                        <Target className="w-4 h-4 mr-2" />
                        View Certificates
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </RouteProtection>
  );
}
