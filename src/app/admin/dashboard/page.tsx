"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Zap,
  Activity,
  Target,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { RouteProtection } from "@/components/RouteProtection";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Mock data for dashboard
const mockDashboardData = {
  stats: {
    totalProjects: 45,
    pendingVerifications: 8,
    activeEnterprises: 28,
    monthlyRevenue: 485000,
    creditsIssued: 2450000,
    creditsTraded: 1890000
  },
  recentActivity: [
    { id: 1, action: "New project submitted", entity: "EcoTech Solutions", time: "2 hours ago", type: "project" },
    { id: 2, action: "Verification completed", entity: "Green Energy Corp", time: "4 hours ago", type: "verification" },
    { id: 3, action: "Credit trade executed", entity: "Carbon Offset Ltd", time: "6 hours ago", type: "trade" },
    { id: 4, action: "Enterprise registered", entity: "Sustainable Industries", time: "8 hours ago", type: "enterprise" },
    { id: 5, action: "Verification request", entity: "Blue Ocean Initiative", time: "1 day ago", type: "verification" }
  ],
  recentProjects: [
    {
      id: 1,
      name: "Mangrove Restoration Project",
      location: "Indonesia",
      credits: 125000,
      status: "Active",
      progress: 78,
      lastUpdate: "2 days ago"
    },
    {
      id: 2,
      name: "Coastal Protection Initiative",
      location: "Philippines",
      credits: 89000,
      status: "Under Review",
      progress: 45,
      lastUpdate: "5 days ago"
    },
    {
      id: 3,
      name: "Seagrass Conservation",
      location: "Australia",
      credits: 156000,
      status: "Active",
      progress: 92,
      lastUpdate: "1 day ago"
    }
  ]
};

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-400';
      case 'under review':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'pending':
        return 'bg-blue-500/20 text-blue-300 border-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FileText className="w-4 h-4" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4" />;
      case 'trade':
        return <TrendingUp className="w-4 h-4" />;
      case 'enterprise':
        return <Building2 className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <RouteProtection allowedRoles={["ADMIN", "VERIFIER"]} redirectTo="/dashboard">
      <AdminLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-400">
                Welcome back, {user?.name || "Admin"}. Here&apos;s what&apos;s happening with your carbon registry.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Total Projects
                </CardTitle>
                <FileText className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-400">
                  {mockDashboardData.stats.totalProjects}
                </div>
                <p className="text-xs text-green-400 mt-1">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Pending Verifications
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">
                  {mockDashboardData.stats.pendingVerifications}
                </div>
                <p className="text-xs text-orange-400 mt-1">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Active Enterprises
                </CardTitle>
                <Building2 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {mockDashboardData.stats.activeEnterprises}
                </div>
                <p className="text-xs text-blue-400 mt-1">
                  +5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Monthly Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(mockDashboardData.stats.monthlyRevenue)}
                </div>
                <p className="text-xs text-green-400 mt-1">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Credits Issued
                </CardTitle>
                <Award className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {(mockDashboardData.stats.creditsIssued / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-purple-400 mt-1">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  Credits Traded
                </CardTitle>
                <Zap className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  {(mockDashboardData.stats.creditsTraded / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-yellow-400 mt-1">
                  +22% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex-shrink-0 text-cyan-400">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {activity.action}
                          </p>
                          <p className="text-xs text-slate-400">
                            {activity.entity} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <span>Recent Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDashboardData.recentProjects.map((project) => (
                      <div key={project.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">
                            {project.name}
                          </h4>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">
                          {project.location} • {project.credits.toLocaleString()} credits
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-3">
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">
                            {project.progress}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Updated {project.lastUpdate}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-600/30 text-white">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-sm">Review Verifications</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-600/30 text-white">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Manage Enterprises</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-400/30 hover:from-green-500/30 hover:to-emerald-600/30 text-white">
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AdminLayout>
    </RouteProtection>
  );
}
