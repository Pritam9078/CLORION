"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  TrendingUp,
  DollarSign,
  Target,
  Download,
  Eye,
  BarChart3,
  Calendar,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { RouteProtection } from "@/components/RouteProtection";

// Extended mock data for portfolio page
const mockPortfolioMetrics = {
  totalCredits: 12500,
  activeCredits: 9800,  
  retiredCredits: 2700,
  portfolioValue: 405000,
  totalInvestment: 320000,
  unrealizedGains: 85000,
  realizedGains: 15500,
  totalReturns: 100500,
  returnPercentage: 31.4,
  co2ImpactTonnes: 12500,
  projectsInvested: 8,
  avgHoldingPeriod: 4.2, // months
  diversificationScore: 8.5 // out of 10
};

const mockDetailedHoldings = [
  {
    id: "1",
    projectName: "Sundarbans Mangrove Restoration",
    location: "Bangladesh",
    ecosystemType: "MANGROVE",
    creditsOwned: 3500,
    averagePrice: 28.50,
    currentPrice: 35.20,
    totalValue: 123200,
    totalCost: 99750,
    unrealizedGain: 23450,
    gainPercentage: 23.5,
    purchaseDate: "2024-01-15",
    vintage: 2024,
    certificationStandard: "Verra VCS",
    risk: "Medium",
    liquidity: "High"
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
    totalCost: 62440,
    unrealizedGain: 17640,
    gainPercentage: 28.2,
    purchaseDate: "2024-02-03",
    vintage: 2024,
    certificationStandard: "Gold Standard",
    risk: "Low",
    liquidity: "High"
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
    totalCost: 104160,
    unrealizedGain: 26460,
    gainPercentage: 25.4,
    purchaseDate: "2024-01-28",
    vintage: 2024,
    certificationStandard: "Verra VCS",
    risk: "Medium",
    liquidity: "Medium"
  },
  {
    id: "4",
    projectName: "Kelp Forest Regeneration",
    location: "California, USA",
    ecosystemType: "KELP",
    creditsOwned: 1800,
    averagePrice: 31.20,
    currentPrice: 29.50,
    totalValue: 53100,
    totalCost: 56160,
    unrealizedGain: -3060,
    gainPercentage: -5.4,
    purchaseDate: "2024-02-20",
    vintage: 2024,
    certificationStandard: "Climate Action Reserve",
    risk: "High",
    liquidity: "Low"
  },
  {
    id: "5",
    projectName: "Coral Reef Restoration",
    location: "Great Barrier Reef, Australia", 
    ecosystemType: "CORAL",
    creditsOwned: 1200,
    averagePrice: 45.60,
    currentPrice: 52.80,
    totalValue: 63360,
    totalCost: 54720,
    unrealizedGain: 8640,
    gainPercentage: 15.8,
    purchaseDate: "2024-03-01",
    vintage: 2024,
    certificationStandard: "Gold Standard",
    risk: "High", 
    liquidity: "Medium"
  }
];

const mockRetiredCredits = [
  {
    id: "ret_1",
    projectName: "Sundarbans Mangrove Restoration",
    creditsRetired: 500,
    retirementDate: "2024-02-15",
    retirementReason: "Corporate CSR - Annual Sustainability Goal",
    certificateId: "RET-SUN-2024-001",
    co2Offset: 500
  },
  {
    id: "ret_2", 
    projectName: "Coastal Seagrass Protection",
    creditsRetired: 1200,
    retirementDate: "2024-01-30",
    retirementReason: "Compliance - Carbon Neutral Certification",
    certificateId: "RET-SEA-2024-002", 
    co2Offset: 1200
  },
  {
    id: "ret_3",
    projectName: "Salt Marsh Conservation", 
    creditsRetired: 1000,
    retirementDate: "2024-03-10",
    retirementReason: "Voluntary Retirement - Climate Action",
    certificateId: "RET-SAL-2024-003",
    co2Offset: 1000
  }
];

export default function PortfolioPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sortBy, setSortBy] = useState("value");
  const [filterBy, setFilterBy] = useState("all");

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
    return `${sign}${num.toFixed(1)}%`;
  };

  const getEcosystemColor = (ecosystem: string) => {
    const colors = {
      "MANGROVE": "bg-green-100 text-green-800",
      "SEAGRASS": "bg-blue-100 text-blue-800", 
      "SALT_MARSH": "bg-purple-100 text-purple-800",
      "KELP": "bg-teal-100 text-teal-800",
      "CORAL": "bg-orange-100 text-orange-800"
    };
    return colors[ecosystem as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      "Low": "bg-green-100 text-green-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "High": "bg-red-100 text-red-800"
    };
    return colors[risk as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <RouteProtection allowedRoles={["TRADER"]} redirectTo="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portfolio Management
            </h1>
            <p className="text-gray-600">
              Track your carbon credit investments and manage your sustainable impact.
            </p>
          </div>

          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockPortfolioMetrics.portfolioValue)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">{formatPercentage(mockPortfolioMetrics.returnPercentage)}</span>
                  <span className="text-gray-500 text-sm ml-1">total return</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Credits</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(mockPortfolioMetrics.totalCredits)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">
                    {mockPortfolioMetrics.projectsInvested} projects • {mockPortfolioMetrics.diversificationScore}/10 diversification
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unrealized Gains</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(mockPortfolioMetrics.unrealizedGains)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-50">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">
                    Realized: {formatCurrency(mockPortfolioMetrics.realizedGains)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">CO₂ Impact</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(mockPortfolioMetrics.co2ImpactTonnes)} t</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-50">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">
                    {formatNumber(mockPortfolioMetrics.retiredCredits)} t retired for compliance
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="retired">Retired</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Allocation</CardTitle>
                    <CardDescription>
                      Distribution of your credits across ecosystem types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { ecosystem: "MANGROVE", percentage: 35.0, value: 123200, color: "bg-green-500" },
                        { ecosystem: "SALT_MARSH", percentage: 32.2, value: 130620, color: "bg-purple-500" },
                        { ecosystem: "SEAGRASS", percentage: 19.8, value: 80080, color: "bg-blue-500" },
                        { ecosystem: "CORAL", percentage: 15.6, value: 63360, color: "bg-orange-500" },
                        { ecosystem: "KELP", percentage: 13.1, value: 53100, color: "bg-teal-500" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-4 h-4 rounded", item.color)}></div>
                            <span className="font-medium">{item.ecosystem}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{item.percentage}%</div>
                            <div className="text-sm text-gray-600">{formatCurrency(item.value)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Key performance indicators for your portfolio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{formatPercentage(31.4)}</div>
                          <div className="text-sm text-green-700">Total Return</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">4.2m</div>
                          <div className="text-sm text-blue-700">Avg Hold Period</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Score</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Liquidity Score</span>
                          <Badge className="bg-green-100 text-green-800">High</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ESG Score</span>
                          <span className="font-semibold">9.2/10</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Holdings Tab */}
            <TabsContent value="holdings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Current Holdings</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Detailed view of all your carbon credit positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDetailedHoldings.map((holding) => (
                      <div key={holding.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900 mb-2">{holding.projectName}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">{holding.location}</span>
                              <Badge className={getEcosystemColor(holding.ecosystemType)} variant="secondary">
                                {holding.ecosystemType}
                              </Badge>
                              <Badge className={getRiskColor(holding.risk)} variant="secondary">
                                {holding.risk} Risk
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {holding.certificationStandard} • Vintage {holding.vintage}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "text-lg font-bold",
                              holding.gainPercentage > 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {formatPercentage(holding.gainPercentage)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {holding.gainPercentage > 0 ? '+' : ''}{formatCurrency(holding.unrealizedGain)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Credits Owned</span>
                            <div className="font-semibold">{formatNumber(holding.creditsOwned)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Value</span>
                            <div className="font-semibold">{formatCurrency(holding.totalValue)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Price</span>
                            <div className="font-semibold">${holding.averagePrice}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Current Price</span>
                            <div className="font-semibold">${holding.currentPrice}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            Purchased: {new Date(holding.purchaseDate).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Activity className="w-4 h-4 mr-1" />
                              Trade
                            </Button>
                            <Button size="sm" variant="outline">
                              <Target className="w-4 h-4 mr-1" />
                              Retire
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Retired Credits Tab */}
            <TabsContent value="retired" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Retired Credits</CardTitle>
                  <CardDescription>
                    Carbon credits you've retired for compliance or voluntary purposes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRetiredCredits.map((retirement) => (
                      <div key={retirement.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{retirement.projectName}</h4>
                            <p className="text-sm text-gray-600">{retirement.retirementReason}</p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">RETIRED</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600">Credits Retired</span>
                            <div className="font-semibold">{formatNumber(retirement.creditsRetired)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">CO₂ Offset</span>
                            <div className="font-semibold">{formatNumber(retirement.co2Offset)} tonnes</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Retirement Date</span>
                            <div className="font-semibold">{new Date(retirement.retirementDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Certificate ID</span>
                            <div className="font-semibold text-blue-600">{retirement.certificateId}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    Advanced analytics and performance insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Portfolio Analytics</h3>
                  <p className="text-gray-600 mb-6">
                    Track performance trends, risk metrics, and get AI-powered insights for your carbon credit portfolio.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">31.4%</div>
                      <div className="text-sm text-gray-600">Total Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">8.5</div>
                      <div className="text-sm text-gray-600">Diversification</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12.5k</div>
                      <div className="text-sm text-gray-600">CO₂ Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">4.2m</div>
                      <div className="text-sm text-gray-600">Avg Hold</div>
                    </div>
                  </div>
                  <Button>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </RouteProtection>
  );
}
