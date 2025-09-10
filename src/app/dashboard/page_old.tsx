"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { RouteProtection } from "@/components/RouteProtection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [user] = useState(mockUser);
  const [stats] = useState(mockStats);
  const [projects] = useState(mockProjects);
  
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
