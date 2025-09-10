"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  Bell,
  Search,
  Eye,
  Award,
  Globe,
  Moon,
  Sun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";

// Mock data for verifier dashboard
const mockVerifierData = {
  stats: {
    pendingVerifications: 12,
    completedThisMonth: 34,
    activeProjects: 67,
    averageProcessingTime: 3.2
  },
  pendingProjects: [
    { id: 1, name: "Mangrove Restoration Project", location: "Thailand", submittedDate: "2024-01-15", priority: "high" },
    { id: 2, name: "Seagrass Conservation", location: "Australia", submittedDate: "2024-01-14", priority: "medium" },
    { id: 3, name: "Salt Marsh Protection", location: "USA", submittedDate: "2024-01-13", priority: "low" },
    { id: 4, name: "Coastal Wetland Restoration", location: "Brazil", submittedDate: "2024-01-12", priority: "high" }
  ],
  recentActivity: [
    { id: 1, action: "Verified project", project: "Ocean Blue Initiative", time: "2 hours ago" },
    { id: 2, action: "Requested additional data", project: "Coral Reef Restoration", time: "4 hours ago" },
    { id: 3, action: "Completed verification", project: "Mangrove Conservation", time: "6 hours ago" },
    { id: 4, action: "Started review", project: "Kelp Forest Project", time: "8 hours ago" }
  ]
};

export default function VerifierDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not verifier
  useEffect(() => {
    if (user && user.role !== 'VERIFIER') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const quickActions = [
    { label: "Review Project", icon: Eye, href: "/verifier/review", color: "bg-blue-500" },
    { label: "View Analytics", icon: BarChart3, href: "/verifier/analytics", color: "bg-green-500" },
    { label: "Generate Report", icon: FileText, href: "/verifier/reports", color: "bg-purple-500" },
    { label: "Project History", icon: Clock, href: "/verifier/history", color: "bg-orange-500" }
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
                src="/clorion-logo.png" 
                alt="CLORIT Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className={cn("text-xl font-bold", 
                isDarkMode ? "text-white" : "text-gray-900"
              )}>CLORIT Verifier</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/verifier/dashboard" className={cn("font-medium transition-colors",
                isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
              )}>
                Dashboard
              </Link>
              <Link href="/verifier/review" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Reviews
              </Link>
              <Link href="/verifier/projects" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Projects
              </Link>
              <Link href="/verifier/analytics" className={cn("font-medium transition-colors",
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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
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
            Welcome back, {user?.name || "Verifier"}!
          </h1>
          <p className={cn("text-lg",
            isDarkMode ? "text-gray-400" : "text-gray-600"
          )}>
            You have {mockVerifierData.stats.pendingVerifications} projects awaiting your verification.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Pending Verifications",
              value: mockVerifierData.stats.pendingVerifications,
              icon: Clock,
              color: "text-orange-600",
              bgColor: isDarkMode ? "bg-orange-900/20" : "bg-orange-50"
            },
            {
              title: "Completed This Month",
              value: mockVerifierData.stats.completedThisMonth,
              icon: CheckCircle,
              color: "text-green-600",
              bgColor: isDarkMode ? "bg-green-900/20" : "bg-green-50"
            },
            {
              title: "Active Projects",
              value: mockVerifierData.stats.activeProjects,
              icon: Globe,
              color: "text-blue-600",
              bgColor: isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
            },
            {
              title: "Avg. Processing Time",
              value: `${mockVerifierData.stats.averageProcessingTime} days`,
              icon: TrendingUp,
              color: "text-purple-600",
              bgColor: isDarkMode ? "bg-purple-900/20" : "bg-purple-50"
            }
          ].map((stat, index) => (
            <Card key={index} className={cn("border-0 shadow-sm",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn("text-sm font-medium",
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                      {stat.title}
                    </p>
                    <p className={cn("text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={cn("text-xl font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn("p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    isDarkMode 
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", action.color)}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className={cn("font-medium",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {action.label}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className={cn("border-0 shadow-sm",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <CardHeader>
                <CardTitle className={cn("flex items-center justify-between",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  <span>Pending Verifications</span>
                  <Badge className={cn(
                    isDarkMode ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-800"
                  )}>
                    {mockVerifierData.stats.pendingVerifications} Pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVerifierData.pendingProjects.map((project) => (
                    <div 
                      key={project.id}
                      className={cn("p-4 rounded-lg border cursor-pointer transition-colors",
                        isDarkMode 
                          ? "border-gray-700 hover:bg-gray-700/50" 
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={cn("font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                          {project.name}
                        </h4>
                        <Badge className={cn(
                          project.priority === 'high' 
                            ? "bg-red-100 text-red-800" 
                            : project.priority === 'medium'
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        )}>
                          {project.priority}
                        </Badge>
                      </div>
                      <p className={cn("text-sm mb-2",
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        Location: {project.location}
                      </p>
                      <p className={cn("text-xs",
                        isDarkMode ? "text-gray-500" : "text-gray-500"
                      )}>
                        Submitted: {project.submittedDate}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className={cn("border-0 shadow-sm",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <CardHeader>
                <CardTitle className={cn(
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVerifierData.recentActivity.map((activity) => (
                    <div 
                      key={activity.id}
                      className={cn("flex items-start space-x-3 p-3 rounded-lg",
                        isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full mt-2",
                        isDarkMode ? "bg-blue-400" : "bg-blue-600"
                      )} />
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                          {activity.action}
                        </p>
                        <p className={cn("text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        )}>
                          {activity.project}
                        </p>
                        <p className={cn("text-xs",
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        )}>
                          {activity.time}
                        </p>
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
