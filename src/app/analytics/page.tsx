"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Shield, 
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Leaf,
  Zap,
  Target,
  Award,
  Calendar,
  MapPin,
  Wallet,
  Link as LinkIcon,
  Factory,
  Satellite,
  Radio,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Camera,
  Building2,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  AlertCircle
} from "lucide-react";
import { cn, formatNumber, formatCurrency, formatPercentage } from "@/lib/utils";
import { useBlockchainData, useWalletBalance } from "@/hooks/useBlockchain";
import { mockUser } from "@/data/mockUser";

// Use consistent mock user data

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalProjects: 45,
    activeProjects: 32,
    totalCredits: 125000,
    creditsTraded: 87500,
    totalRevenue: 2875000,
    marketValue: 4125000,
    projectGrowth: 18.5,
    creditGrowth: 24.2,
    revenueGrowth: 31.7
  },
  ecosystemBreakdown: [
    { ecosystem: "Mangrove", projects: 18, credits: 52000, percentage: 41.6, value: 1690000 },
    { ecosystem: "Seagrass", projects: 15, credits: 38500, percentage: 30.8, value: 946250 },
    { ecosystem: "Salt Marsh", projects: 12, credits: 34500, percentage: 27.6, value: 1488750 }
  ],
  regionalData: [
    { region: "Southeast Asia", projects: 20, credits: 55000, revenue: 1430000 },
    { region: "Pacific Islands", projects: 12, credits: 35000, revenue: 910000 },
    { region: "Caribbean", projects: 8, credits: 22000, revenue: 374000 },
    { region: "West Africa", projects: 5, credits: 13000, revenue: 161000 }
  ],
  monthlyTrends: [
    { month: "Jan", credits: 8500, revenue: 221000, projects: 3 },
    { month: "Feb", credits: 12000, revenue: 312000, projects: 4 },
    { month: "Mar", credits: 15500, revenue: 403000, projects: 5 },
    { month: "Apr", credits: 18200, revenue: 473000, projects: 6 },
    { month: "May", credits: 21000, revenue: 546000, projects: 7 },
    { month: "Jun", credits: 24800, revenue: 645000, projects: 8 }
  ],
  verificationStats: {
    totalVerifications: 156,
    pendingVerifications: 12,
    approvedVerifications: 132,
    rejectedVerifications: 12,
    averageVerificationTime: 8.5, // days
    verificationAccuracy: 94.2
  },
  marketplaceStats: {
    totalTransactions: 1205,
    averageTransactionSize: 156,
    totalVolume: 87500,
    averagePrice: 32.85,
    priceRange: { min: 18.50, max: 48.20 },
    topBuyers: 45,
    activeSellers: 28
  }
};

export default function AnalyticsPage() {
  const [user] = useState(mockUser);
  const [analytics] = useState(mockAnalytics);
  const [timeRange, setTimeRange] = useState("6M"); // 1M, 3M, 6M, 1Y, ALL
  const [selectedMetric, setSelectedMetric] = useState("credits");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-gray-900">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Platform Analytics
              </h1>
              <p className="text-gray-700">
                Comprehensive insights into CLORIT's blue carbon registry performance powered by Alchemy
              </p>
            </div>
            
            {/* Navigation Helper for Different Roles */}
            <div className="text-sm">
              {user.role === "VERIFIER" && (
                <div className="text-gray-500 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                  <p className="mb-1">
                    <span className="font-medium text-purple-700">🔧 Admin:</span>
                  </p>
                  <p>
                    For detailed admin metrics, visit{" "}
                    <a 
                      href="/admin/dashboard" 
                      className="text-purple-600 hover:text-purple-800 underline font-medium"
                    >
                      Admin Dashboard → Admin Analytics Tab
                    </a>
                  </p>
                </div>
              )}
              
              {user.role === "PROJECT_OWNER" && (
                <div className="text-gray-500 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <p className="mb-1">
                    <span className="font-medium text-green-700">🌱 Project Owner:</span>
                  </p>
                  <p>
                    View platform-wide carbon credit and project analytics here. 
                    Check your personal projects in{" "}
                    <a 
                      href="/dashboard" 
                      className="text-green-600 hover:text-green-800 underline font-medium"
                    >
                      Your Dashboard
                    </a>
                  </p>
                </div>
              )}
              
              {user.role === "TRADER" && (
                <div className="text-gray-500 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <p className="mb-1">
                    <span className="font-medium text-blue-700">💼 Trader:</span>
                  </p>
                  <p>
                    Analyze market trends and trading opportunities. 
                    Manage your portfolio in{" "}
                    <a 
                      href="/dashboard" 
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Your Dashboard
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            {["1M", "3M", "6M", "1Y", "ALL"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={cn(
                  timeRange === range 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalProjects}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{analytics.overview.projectGrowth}%</span>
                  </div>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Carbon Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalCredits)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{analytics.overview.creditGrowth}%</span>
                  </div>
                </div>
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+{analytics.overview.revenueGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Market Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.marketValue)}</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm text-blue-600">Live Market</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Metrics with Alchemy */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Network Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {isConnected ? "Connected" : "Offline"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentBlock ? `Block #${currentBlock.number?.toString().slice(-6)}` : "..."}
                  </p>
                </div>
                <LinkIcon className={`w-8 h-8 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Gas Price</p>
                  <p className="text-lg font-bold text-gray-900">
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
                  <p className="text-sm font-medium text-gray-600">Platform ETH Balance</p>
                  <p className="text-lg font-bold text-gray-900">
                    {balanceLoading ? "..." : ethBalance ? `${parseFloat(ethBalance).toFixed(4)}` : "0.0000"}
                  </p>
                  <p className="text-xs text-gray-500">ETH</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Blockchain Transactions</p>
                  <p className="text-lg font-bold text-gray-900">{formatNumber(analytics.marketplaceStats.totalTransactions)}</p>
                  <p className="text-xs text-gray-500">All-time</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ecosystem Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Ecosystem Distribution
              </CardTitle>
              <CardDescription>
                Blue carbon projects by ecosystem type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.ecosystemBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full",
                        index === 0 ? "bg-blue-600" : index === 1 ? "bg-green-600" : "bg-purple-600"
                      )} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.ecosystem}</p>
                        <p className="text-xs text-gray-500">{item.projects} projects</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatPercentage(item.percentage)}</p>
                      <p className="text-xs text-gray-500">{formatNumber(item.credits)} credits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Regional Performance
              </CardTitle>
              <CardDescription>
                Project distribution and revenue by region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.regionalData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.region}</p>
                      <p className="text-xs text-gray-500">{item.projects} projects • {formatNumber(item.credits)} credits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{formatCurrency(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Monthly Trends
              </CardTitle>
              <CardDescription>
                Credits traded and revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{item.month} 2024</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Credits</p>
                        <p className="text-sm font-medium text-blue-600">{formatNumber(item.credits)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-sm font-medium text-green-600">{formatCurrency(item.revenue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Verification Statistics
              </CardTitle>
              <CardDescription>
                MRV system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{analytics.verificationStats.totalVerifications}</p>
                    <p className="text-sm text-gray-600">Total Verifications</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formatPercentage(analytics.verificationStats.verificationAccuracy)}</p>
                    <p className="text-sm text-gray-600">Accuracy Rate</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="text-sm font-medium text-green-600">{analytics.verificationStats.approvedVerifications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-yellow-600">{analytics.verificationStats.pendingVerifications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Processing Time</span>
                    <span className="text-sm font-medium text-blue-600">{analytics.verificationStats.averageVerificationTime} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Analytics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Marketplace Performance
            </CardTitle>
            <CardDescription>
              Trading activity and market dynamics powered by Alchemy blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Trading Volume</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Transactions</span>
                    <span className="text-sm font-medium">{formatNumber(analytics.marketplaceStats.totalTransactions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Credits Traded</span>
                    <span className="text-sm font-medium">{formatNumber(analytics.marketplaceStats.totalVolume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Transaction Size</span>
                    <span className="text-sm font-medium">{analytics.marketplaceStats.averageTransactionSize} credits</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Pricing Analytics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Price</span>
                    <span className="text-sm font-medium">{formatCurrency(analytics.marketplaceStats.averagePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price Range</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(analytics.marketplaceStats.priceRange.min)} - {formatCurrency(analytics.marketplaceStats.priceRange.max)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Gas Fee</span>
                    <span className="text-sm font-medium text-orange-600">
                      {gasPrice ? `${parseFloat(gasPrice).toFixed(6)} ETH` : "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Market Participants</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Buyers</span>
                    <span className="text-sm font-medium">{analytics.marketplaceStats.topBuyers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Sellers</span>
                    <span className="text-sm font-medium">{analytics.marketplaceStats.activeSellers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blockchain Network</span>
                    <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isConnected ? 'Ethereum Sepolia' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Analytics Report
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Set Performance Goals
          </Button>
        </div>
      </main>
    </div>
  );
}