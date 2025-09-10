"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Download,
  Calendar,
  Filter,
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  User,
  Target,
  Globe,
  Zap,
  FileText,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";

// Mock analytics data
const analyticsData = {
  overview: {
    totalProjects: 45,
    totalEnterprises: 28,
    totalCreditsIssued: 2450000,
    totalCreditsTraded: 1890000,
    averageProjectSize: 54444,
    verificationsPending: 8,
    monthlyGrowth: 12.5,
    revenue: 485000
  },
  projectsOverTime: [
    { month: "Jan", projects: 5, verified: 4, pending: 1 },
    { month: "Feb", projects: 8, verified: 7, pending: 1 },
    { month: "Mar", projects: 12, verified: 10, pending: 2 },
    { month: "Apr", projects: 18, verified: 15, pending: 3 },
    { month: "May", projects: 25, verified: 22, pending: 3 },
    { month: "Jun", projects: 32, verified: 28, pending: 4 },
    { month: "Jul", projects: 38, verified: 34, pending: 4 },
    { month: "Aug", projects: 42, verified: 37, pending: 5 },
    { month: "Sep", projects: 45, verified: 38, pending: 7 },
    { month: "Oct", projects: 45, verified: 40, pending: 5 },
    { month: "Nov", projects: 45, verified: 42, pending: 3 },
    { month: "Dec", projects: 45, verified: 37, pending: 8 }
  ],
  userActivity: [
    { week: "Week 1", projectOwners: 45, verifiers: 12, traders: 89, total: 146 },
    { week: "Week 2", projectOwners: 52, verifiers: 14, traders: 95, total: 161 },
    { week: "Week 3", projectOwners: 48, verifiers: 11, traders: 102, total: 161 },
    { week: "Week 4", projectOwners: 55, verifiers: 15, traders: 108, total: 178 }
  ],
  verificationStats: {
    pending: 8,
    approved: 37,
    rejected: 5,
    averageTime: "4.2 days",
    successRate: 88
  },
  projectCategories: [
    { category: "Mangrove", count: 18, percentage: 40, credits: 980000 },
    { category: "Seagrass", count: 12, percentage: 27, credits: 650000 },
    { category: "Salt Marsh", count: 8, percentage: 18, credits: 420000 },
    { category: "Kelp Forest", count: 4, percentage: 9, credits: 250000 },
    { category: "Other", count: 3, percentage: 6, credits: 150000 }
  ],
  riskDistribution: [
    { risk: "Low", count: 25, percentage: 56, color: "green" },
    { risk: "Medium", count: 15, percentage: 33, color: "yellow" },
    { risk: "High", count: 5, percentage: 11, color: "red" }
  ],
  topPerformers: [
    { name: "EcoTech Solutions", projects: 5, credits: 125000, score: 95 },
    { name: "Marine Life Foundation", projects: 3, credits: 87500, score: 92 },
    { name: "Ocean Guardians", projects: 4, credits: 98000, score: 89 },
    { name: "Blue Carbon Inc", projects: 2, credits: 65000, score: 87 },
    { name: "Coastal Restoration", projects: 3, credits: 72000, score: 85 }
  ]
};

type TimeRange = "7d" | "30d" | "90d" | "1y";
type ExportFormat = "csv" | "pdf" | "xlsx";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [selectedMetric, setSelectedMetric] = useState("projects");
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const exportData = async (format: ExportFormat) => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting analytics data as ${format.toUpperCase()}`);
    setIsExporting(false);
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const SimpleBarChart = ({ data, color = "blue" }: { data: { projects?: number; total?: number; [key: string]: any }[], color?: string }) => {
    const maxValue = Math.max(...data.map(d => d.projects || d.total || 0));
    
    return (
      <div className="flex items-end space-x-2 h-40">
        {data.slice(-8).map((item, index) => {
          const height = ((item.projects || item.total || 0) / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-end mb-2" style={{ height: '120px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={cn("w-full rounded-t-sm",
                    color === "blue" ? "bg-blue-500" :
                    color === "green" ? "bg-green-500" :
                    color === "purple" ? "bg-purple-500" : "bg-gray-500"
                  )}
                />
              </div>
              <span className="text-xs text-gray-600 text-center">
                {item.month || item.week || item.category}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const SimplePieChart = ({ data }: { data: { count: number; [key: string]: any }[] }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              "M", 50, 50,
              "L", startX, startY,
              "A", 40, 40, 0, largeArcFlag, 1, endX, endY,
              "Z"
            ].join(" ");
            
            currentAngle += angle;
            
            return (
              <motion.path
                key={index}
                d={pathData}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  item.color === "green" ? "fill-green-500" :
                  item.color === "yellow" ? "fill-yellow-500" :
                  item.color === "red" ? "fill-red-500" :
                  `fill-blue-${500 + index * 100}`
                )}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/clorion-logo.png" 
                alt="CLORIT Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-gray-900">CLORIT Admin</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/dashboard" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/projects" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link href="/admin/verification" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Verification
              </Link>
              <Link href="/admin/enterprises" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Enterprises
              </Link>
              <Link href="/admin/analytics" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              {/* Profile Dropdown */}
              <ProfileDropdown isDarkMode={false} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-lg text-gray-600">Comprehensive platform insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData("csv")}
                  disabled={isExporting}
                  className="flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData("pdf")}
                  disabled={isExporting}
                  className="flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportData("xlsx")}
                  disabled={isExporting}
                  className="flex items-center space-x-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>Excel</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: "Total Projects", 
                value: analyticsData.overview.totalProjects,
                growth: "+15%",
                color: "blue",
                icon: Target
              },
              { 
                label: "Active Enterprises", 
                value: analyticsData.overview.totalEnterprises,
                growth: "+8%",
                color: "green",
                icon: Building2
              },
              { 
                label: "Credits Issued", 
                value: `${(analyticsData.overview.totalCreditsIssued / 1000000).toFixed(1)}M`,
                growth: "+22%",
                color: "purple",
                icon: Zap
              },
              { 
                label: "Platform Revenue", 
                value: `$${(analyticsData.overview.revenue / 1000).toFixed(0)}K`,
                growth: "+18%",
                color: "orange",
                icon: DollarSign
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className={cn("text-sm font-medium", getGrowthColor(15))}>
                          {metric.growth} from last month
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-lg",
                        metric.color === "blue" ? "bg-blue-100 text-blue-600" :
                        metric.color === "green" ? "bg-green-100 text-green-600" :
                        metric.color === "purple" ? "bg-purple-100 text-purple-600" :
                        "bg-orange-100 text-orange-600"
                      )}>
                        <metric.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Projects Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Project Growth Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={analyticsData.projectsOverTime} color="blue" />
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-gray-600">Total Projects</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>User Activity Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={analyticsData.userActivity} color="green" />
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-600">Active Users</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Risk Distribution & Project Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-red-600" />
                  <span>Risk Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <SimplePieChart data={analyticsData.riskDistribution} />
                  <div className="space-y-3">
                    {analyticsData.riskDistribution.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={cn("w-4 h-4 rounded-full",
                          item.color === "green" ? "bg-green-500" :
                          item.color === "yellow" ? "bg-yellow-500" : "bg-red-500"
                        )} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.risk} Risk</p>
                          <p className="text-xs text-gray-600">{item.count} projects ({item.percentage}%)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>Project Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.projectCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{category.category}</span>
                        <span className="text-sm text-gray-600">{category.count} projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={cn("h-2 rounded-full",
                              index === 0 ? "bg-blue-500" :
                              index === 1 ? "bg-green-500" :
                              index === 2 ? "bg-purple-500" :
                              index === 3 ? "bg-yellow-500" : "bg-gray-500"
                            )}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Verification Stats & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Verification Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Verification Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.verificationStats.successRate}%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{analyticsData.verificationStats.averageTime}</p>
                    <p className="text-sm text-gray-600">Avg. Processing Time</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="text-sm font-medium text-green-600">{analyticsData.verificationStats.approved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-medium text-yellow-600">{analyticsData.verificationStats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rejected</span>
                    <span className="text-sm font-medium text-red-600">{analyticsData.verificationStats.rejected}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Top Performing Enterprises</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPerformers.map((performer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                          <p className="text-xs text-gray-600">{performer.projects} projects</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{performer.credits.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">credits</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
