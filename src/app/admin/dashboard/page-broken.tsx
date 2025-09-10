"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    { id: 2, action: "Verification completed", entity: "Mangrove Restoration", time: "4 hours ago", type: "verification" },
    { id: 3, action: "Enterprise registered", entity: "Green Ocean Corp", time: "6 hours ago", type: "enterprise" },
    { id: 4, action: "Credits traded", entity: "50,000 credits", time: "8 hours ago", type: "trade" },
    { id: 5, action: "Risk assessment updated", entity: "Salt Marsh Project", time: "12 hours ago", type: "risk" }
  ],
  notifications: [
    { id: 1, message: "3 projects require verification", type: "warning", read: false },
    { id: 2, message: "Monthly compliance report ready", type: "info", read: false },
    { id: 3, message: "System maintenance scheduled", type: "info", read: true },
    { id: 4, message: "New enterprise pending approval", type: "warning", read: false }
  ]
};

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(mockDashboardData.notifications);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Redirect if not admin/verifier
  useEffect(() => {
    if (user && !['ADMIN', 'VERIFIER'].includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const quickActions = [
    { label: "Verify Project", icon: CheckCircle, href: "/admin/verification", color: "bg-green-500" },
    { label: "Add Enterprise", icon: Building2, href: "/admin/enterprises", color: "bg-blue-500" },
    { label: "View Analytics", icon: BarChart3, href: "/admin/analytics", color: "bg-purple-500" },
    { label: "Generate Report", icon: FileText, href: "/admin/reports", color: "bg-orange-500" }
  ];

  return (
    <div className={cn("min-h-screen transition-colors duration-300", 
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={cn("backdrop-blur-sm border-b sticky top-0 z-40",
          isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/clorit-logo-new.png" 
                alt="CLORIT Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className={cn("text-xl font-bold", 
                isDarkMode ? "text-white" : "text-gray-900"
              )}>CLORIT Admin</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/dashboard" className={cn("font-medium transition-colors",
                isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
              )}>
                Dashboard
              </Link>
              <Link href="/admin/projects" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Projects
              </Link>
              <Link href="/admin/verification" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Verification
              </Link>
              <Link href="/admin/satellite-analysis" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Satellite Analysis
              </Link>
              <Link href="/admin/enterprises" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Enterprises
              </Link>
              <Link href="/admin/analytics" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Analytics
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn("w-9 h-9 p-0",
                  isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("relative w-9 h-9 p-0",
                  isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              {/* Profile Dropdown */}
              <ProfileDropdown isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className={cn("text-3xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Welcome back, {user?.name || "Admin"}
          </h1>
          <p className={cn("text-lg",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            Here's what's happening with your blue carbon registry platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: "Total Projects", 
              value: mockDashboardData.stats.totalProjects, 
              change: "+12%",
              icon: Target,
              color: "blue" 
            },
            { 
              label: "Pending Verifications", 
              value: mockDashboardData.stats.pendingVerifications, 
              change: "-5%",
              icon: Clock,
              color: "yellow" 
            },
            { 
              label: "Active Enterprises", 
              value: mockDashboardData.stats.activeEnterprises, 
              change: "+8%",
              icon: Building2,
              color: "green" 
            },
            { 
              label: "Monthly Revenue", 
              value: `$${(mockDashboardData.stats.monthlyRevenue / 1000).toFixed(0)}K`, 
              change: "+18%",
              icon: TrendingUp,
              color: "purple" 
            },
            { 
              label: "Credits Issued", 
              value: `${(mockDashboardData.stats.creditsIssued / 1000000).toFixed(1)}M`, 
              change: "+22%",
              icon: Award,
              color: "orange" 
            },
            { 
              label: "Credits Traded", 
              value: `${(mockDashboardData.stats.creditsTraded / 1000000).toFixed(1)}M`, 
              change: "+15%",
              icon: Activity,
              color: "pink" 
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className={cn("border-0 shadow-sm",
                isDarkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-md"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-sm mb-1",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>{stat.label}</p>
                      <p className={cn("text-2xl font-bold",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>{stat.value}</p>
                      <p className={cn("text-sm font-medium",
                        stat.change.startsWith('+') 
                          ? "text-green-600" 
                          : stat.change.startsWith('-') 
                            ? "text-red-600" 
                            : "text-gray-600"
                      )}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-lg",
                      stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                      stat.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                      stat.color === "green" ? "bg-green-100 text-green-600" :
                      stat.color === "purple" ? "bg-purple-100 text-purple-600" :
                      stat.color === "orange" ? "bg-orange-100 text-orange-600" :
                      "bg-pink-100 text-pink-600"
                    )}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className={cn("border-0 shadow-sm",
            isDarkMode ? "bg-gray-800" : "bg-white"
          )}>
            <CardHeader>
              <CardTitle className={cn("flex items-center space-x-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={action.href}>
                      <Button 
                        variant="outline" 
                        className={cn("h-auto p-4 flex flex-col items-center space-y-2 w-full",
                          isDarkMode ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", action.color)}>
                          <action.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity & Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className={cn("border-0 shadow-sm",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <CardHeader>
                <CardTitle className={cn("flex items-center space-x-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDashboardData.recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={cn("w-2 h-2 rounded-full mt-2",
                        activity.type === "project" ? "bg-blue-500" :
                        activity.type === "verification" ? "bg-green-500" :
                        activity.type === "enterprise" ? "bg-purple-500" :
                        activity.type === "trade" ? "bg-orange-500" : "bg-red-500"
                      )} />
                      <div className="flex-1">
                        <p className={cn("text-sm",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>{activity.action}</p>
                        <p className={cn("text-xs",
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        )}>{activity.entity}</p>
                        <p className={cn("text-xs",
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        )}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className={cn("border-0 shadow-sm",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <CardHeader>
                <CardTitle className={cn("flex items-center space-x-2",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  <Bell className="w-5 h-5 text-red-600" />
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {unreadNotifications} unread
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn("p-3 rounded-lg cursor-pointer transition-colors",
                        notification.read 
                          ? (isDarkMode ? "bg-gray-700/50" : "bg-gray-50") 
                          : (isDarkMode ? "bg-gray-700" : "bg-blue-50"),
                        "hover:opacity-80"
                      )}
                      onClick={() => handleNotificationRead(notification.id)}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={cn("w-2 h-2 rounded-full mt-2",
                          notification.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                        )} />
                        <p className={cn("text-sm flex-1",
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        )}>{notification.message}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
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