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
  Leaf, 
  TrendingUp, 
  Shield, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Activity,
  Plus,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn, formatNumber, formatCurrency } from "@/lib/utils";

// Mock data for project owners
const mockProjects = [
  {
    id: "1",
    name: "Mangrove Restoration Kenya",
    location: "Mombasa, Kenya",
    status: "ACTIVE",
    creditsEarned: 2450,
    totalArea: 150,
    ecosystemType: "MANGROVE",
    lastUpdate: "2024-03-10"
  },
  {
    id: "2", 
    name: "Seagrass Conservation Maldives",
    location: "Addu Atoll, Maldives",
    status: "VERIFICATION", 
    creditsEarned: 1800,
    totalArea: 85,
    ecosystemType: "SEAGRASS",
    lastUpdate: "2024-03-08"
  },
  {
    id: "3",
    name: "Salt Marsh Restoration Netherlands",
    location: "Wadden Sea, Netherlands", 
    status: "ACTIVE",
    creditsEarned: 3200,
    totalArea: 200,
    ecosystemType: "SALT_MARSH",
    lastUpdate: "2024-03-12"
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect traders to their dedicated dashboard
  useEffect(() => {
    if (user?.role === "TRADER") {
      router.push("/trader/dashboard");
      return;
    }
  }, [user, router]);

  // Don't render if trader (they get redirected)
  if (user?.role === "TRADER") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to Trader Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Loading state handled by RouteProtection
  }

  const stats = [
    { label: "Active Projects", value: "3", icon: Leaf, color: "text-green-600" },
    { label: "Total Credits Earned", value: "7,450", icon: Shield, color: "text-blue-600" },
    { label: "Credits Under Review", value: "1,800", icon: Clock, color: "text-orange-600" },
    { label: "Total Revenue", value: "$298,000", icon: DollarSign, color: "text-purple-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "VERIFICATION": return "bg-orange-100 text-orange-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
    <RouteProtection allowedRoles={["PROJECT_OWNER"]} redirectTo="/admin/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              Manage your blue carbon projects and track their environmental impact.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={cn("p-3 rounded-full bg-gray-50", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and project management options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => router.push('/projects/new')}
                      className="flex items-center justify-start h-auto p-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-left"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-semibold">Register New Project</div>
                        <div className="text-sm opacity-90">Start your blue carbon initiative</div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/projects')}
                      className="flex items-center justify-start h-auto p-4 text-left"
                    >
                      <Eye className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-semibold">View My Projects</div>
                        <div className="text-sm opacity-90">Manage existing projects</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline"
                      onClick={() => router.push('/marketplace')} 
                      className="flex items-center justify-start h-auto p-4 text-left"
                    >
                      <TrendingUp className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-semibold">Browse Marketplace</div>
                        <div className="text-sm opacity-90">Explore carbon credit market</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline"
                      onClick={() => router.push('/analytics')}
                      className="flex items-center justify-start h-auto p-4 text-left"
                    >
                      <Activity className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-semibold">View Analytics</div>
                        <div className="text-sm opacity-90">Track project performance</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>
                    Overview of your blue carbon initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProjects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{project.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {project.location}
                              <Badge className={getEcosystemColor(project.ecosystemType)} variant="secondary">
                                {project.ecosystemType}
                              </Badge>
                            </div>
                          </div>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Credits Earned:</span>
                            <div className="font-semibold">{formatNumber(project.creditsEarned)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Project Area:</span>
                            <div className="font-semibold">{project.totalArea} hectares</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Update:</span>
                            <div className="font-semibold">{new Date(project.lastUpdate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" onClick={() => router.push('/projects')}>
                      <Eye className="w-4 h-4 mr-2" />
                      View All Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.role.replace("_", " ")}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wallet:</span>
                      <span className="font-medium">
                        {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : "Not connected"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Project verification completed</p>
                      <p className="text-xs text-gray-500">Mangrove Restoration Kenya • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Credits earned</p>
                      <p className="text-xs text-gray-500">+450 credits • Salt Marsh project • 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Submitted for verification</p>
                      <p className="text-xs text-gray-500">Seagrass project • 3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Project Guide
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Join Community Forum
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Learn About Verification
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </RouteProtection>
  );
}
  Zap,
  Link,
  Coins
} from "lucide-react";
import { cn, formatNumber, formatCurrency, formatDate, getStatusColor, getEcosystemColor } from "@/lib/utils";
import { useBlockchainData, useWalletBalance } from "@/hooks/useBlockchain";
import { alchemyService } from "@/lib/alchemy";
import { mockUser } from "@/data/mockUser";

// Mock data - this would come from your API
const mockProjects = [
  {
    id: "1",
    name: "Sundarbans Mangrove Restoration",
    location: "Bangladesh",
    area: 1250,
    ecosystemType: "MANGROVE",
    status: "VERIFIED",
    co2Captured: 15000,
    creditsIssued: 12000,
    creditsAvailable: 8000,
    projectValue: 480000,
    startDate: "2023-03-15",
    endDate: "2026-03-15",
    verificationStatus: "ACTIVE",
    carbonPrice: 40
  },
  {
    id: "2", 
    name: "Seagrass Conservation Initiative",
    location: "Australia",
    area: 800,
    ecosystemType: "SEAGRASS",
    status: "PENDING",
    co2Captured: 9200,
    creditsIssued: 0,
    creditsAvailable: 0,
    projectValue: 350000,
    startDate: "2023-06-01",
    endDate: "2025-12-31",
    verificationStatus: "PENDING",
    carbonPrice: 38
  }
];

const mockStats = {
  totalProjects: 127,
  activeProjects: 98,
  pendingVerifications: 12,
  totalCredits: 450000,
  retiredCredits: 125000
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect traders to their dedicated dashboard
  useEffect(() => {
    if (user?.role === "TRADER") {
      router.push("/trader/dashboard");
    }
  }, [user, router]);

  // Don't render if trader (they get redirected)
  if (user?.role === "TRADER") {
    return null;
  }
  
  // Blockchain data
  const { currentBlock, gasPrice, isConnected } = useBlockchainData();
  const { balance: ethBalance } = useWalletBalance(user.walletAddress);

  const getRoleSpecificStats = () => {
    switch (user.role) {
      case "PROJECT_OWNER":
        return [
          { label: "My Projects", value: "3", icon: Leaf, color: "text-green-600" },
          { label: "Credits Earned", value: "2,450", icon: Shield, color: "text-blue-600" },
          { label: "Pending Reviews", value: "1", icon: Eye, color: "text-orange-600" },
          { label: "Wallet Balance", value: ethBalance ? `${parseFloat(ethBalance).toFixed(4)} ETH` : "0.0000 ETH", icon: Coins, color: "text-yellow-600" },
        ];
      case "TRADER":
        return [
          { label: "Portfolio Value", value: formatCurrency(156000), icon: DollarSign, color: "text-green-600" },
          { label: "Credits Owned", value: "5,200", icon: Shield, color: "text-purple-600" },
          { label: "Credits Retired", value: "2,800", icon: Activity, color: "text-red-600" },
          { label: "ETH Balance", value: ethBalance ? `${parseFloat(ethBalance).toFixed(4)} ETH` : "0.0000 ETH", icon: Coins, color: "text-yellow-600" },
        ];
      default:
        return [
          { label: "Welcome", value: "Dashboard", icon: Activity, color: "text-blue-600" },
          { label: "Getting Started", value: "Guide", icon: Eye, color: "text-green-600" },
          { label: "Support", value: "Help", icon: Shield, color: "text-purple-600" },
          { label: "Community", value: "Join", icon: Users, color: "text-orange-600" },
        ];
    }
  };

  const getRoleSpecificActions = () => {
    switch (user.role) {
      case "PROJECT_OWNER":
        return [
          { label: "Register New Project", href: "/projects/new", icon: Plus },
          { label: "View My Projects", href: "/projects", icon: Eye },
        ];
      case "TRADER":
        return [
          { label: "Browse Marketplace", href: "/marketplace", icon: TrendingUp },
          { label: "View Portfolio", href: "/portfolio", icon: Shield },
        ];
      default:
        return [
          { label: "Getting Started", href: "/help", icon: Eye },
          { label: "Contact Support", href: "/support", icon: Users },
        ];
    }
  };

  return (
    <RouteProtection allowedRoles={["PROJECT_OWNER", "TRADER"]} redirectTo="/admin/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              {user.role === "PROJECT_OWNER" && "Manage your blue carbon projects and track their impact."}
              {user.role === "TRADER" && "Explore carbon credits and manage your portfolio."}
              {!["PROJECT_OWNER", "TRADER"].includes(user.role) && "Welcome to your CLORION dashboard."}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {getRoleSpecificStats().map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={cn("p-3 rounded-full bg-gray-50", stat.color)}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Get started with common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getRoleSpecificActions().map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto p-4"
                        asChild
                      >
                        <a href={action.href}>
                          <action.icon className="w-4 h-4 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">{action.label}</div>
                          </div>
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              {user.role === "PROJECT_OWNER" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      My Recent Projects
                    </CardTitle>
                    <CardDescription>
                      Track your project progress and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              <span>{project.area} hectares</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <span>{formatNumber(project.creditsIssued)} credits</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(project.projectValue)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Marketplace Preview for Traders */}
              {user.role === "TRADER" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Featured Credits
                    </CardTitle>
                    <CardDescription>
                      Explore available carbon credits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.filter(p => p.status === "VERIFIED").map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                ${project.carbonPrice}
                              </div>
                              <div className="text-sm text-gray-600">per credit</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <span>{formatNumber(project.creditsAvailable)} available</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Network Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Connection</span>
                      <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Block</span>
                      <span className="text-sm font-mono">
                        {currentBlock?.number ? `#${currentBlock.number.toString()}` : "Loading..."}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gas Price</span>
                      <span className="text-sm font-mono">
                        {gasPrice ? `${parseFloat(gasPrice).toFixed(6)} ETH` : "Loading..."}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Account Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Role</span>
                      <Badge variant="outline">
                        {user.role.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Wallet</span>
                      <span className="text-sm font-mono">
                        {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : "Not connected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="text-sm">January 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </RouteProtection>
  );
}
