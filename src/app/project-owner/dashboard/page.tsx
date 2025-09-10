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
  Clock,
  ShoppingCart,
  BarChart3,
  FileText,
  Award,
  Building
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
    name: "Coastal Wetland Restoration",
    location: "Louisiana, USA",
    status: "PENDING",
    creditsEarned: 0,
    totalArea: 220,
    ecosystemType: "SALT_MARSH",
    lastUpdate: "2024-03-05"
  }
];

// Mock recent activity
const mockActivity = [
  {
    id: "1",
    type: "VERIFICATION_COMPLETED",
    message: "Mangrove Restoration Kenya verification completed",
    timestamp: "2024-03-10T14:30:00Z",
    icon: CheckCircle,
    color: "text-green-600"
  },
  {
    id: "2", 
    type: "CREDITS_PURCHASED",
    message: "Purchased 500 credits from Sundarbans project",
    timestamp: "2024-03-08T10:15:00Z",
    icon: ShoppingCart,
    color: "text-blue-600"
  },
  {
    id: "3",
    type: "PROJECT_SUBMITTED",
    message: "Coastal Wetland Restoration submitted for review",
    timestamp: "2024-03-05T16:45:00Z",
    icon: FileText,
    color: "text-orange-600"
  },
  {
    id: "4",
    type: "PAYMENT_RECEIVED",
    message: "Payment of $103,250 received for credit sales",
    timestamp: "2024-03-03T09:20:00Z",
    icon: DollarSign,
    color: "text-purple-600"
  }
];

// Mock upcoming tasks/deadlines
const mockUpcomingTasks = [
  {
    id: "1",
    title: "Annual Project Report Due",
    project: "Mangrove Restoration Kenya",
    dueDate: "2024-03-25",
    priority: "HIGH",
    type: "REPORT"
  },
  {
    id: "2",
    title: "Satellite Data Review",
    project: "Seagrass Conservation Maldives",
    dueDate: "2024-03-20",
    priority: "MEDIUM",
    type: "VERIFICATION"
  },
  {
    id: "3",
    title: "Community Meeting Schedule",
    project: "Coastal Wetland Restoration",
    dueDate: "2024-03-18",
    priority: "MEDIUM",
    type: "COMMUNITY"
  }
];

export default function ProjectOwnerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects] = useState(mockProjects);
  const [recentActivity] = useState(mockActivity);
  const [upcomingTasks] = useState(mockUpcomingTasks);

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
    { label: "Credits in Portfolio", value: "2,750", icon: Shield, color: "text-blue-600" },
    { label: "Credits Earned", value: "7,450", icon: TrendingUp, color: "text-emerald-600" },
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <RouteProtection allowedRoles={["PROJECT_OWNER"]} redirectTo="/admin/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-h2 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-body">
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
                      <p className="text-body-small font-medium text-gray-600">{stat.label}</p>
                      <p className="stat-number">{stat.value}</p>
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
                      onClick={() => router.push('/project-owner/buy-credits')} 
                      className="flex items-center justify-start h-auto p-4 text-left"
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-semibold">Buy Carbon Credits</div>
                        <div className="text-sm opacity-90">Purchase verified carbon credits</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline"
                      onClick={() => router.push('/analytics')}
                      className="flex items-center justify-start h-auto p-4 text-left"
                    >
                      <BarChart3 className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-semibold">View Analytics</div>
                        <div className="text-sm opacity-90">Track performance metrics</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* My Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>My Projects</CardTitle>
                  <CardDescription>
                    Your active blue carbon projects and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <div className="flex gap-2">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                              <Badge className={getEcosystemColor(project.ecosystemType)} variant="outline">
                                {project.ecosystemType.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Shield className="w-4 h-4" />
                              <span>{formatNumber(project.creditsEarned)} credits earned</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4" />
                              <span>{project.totalArea} hectares</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Last updated: {new Date(project.lastUpdate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates and actions on your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                        <div className={cn("p-2 rounded-full bg-gray-50", activity.color)}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>
                    Important deadlines and actions required
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{task.project}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Credit Portfolio Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Portfolio</CardTitle>
                  <CardDescription>
                    Your carbon credit holdings and recent transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">2,750</div>
                        <div className="text-sm text-gray-600">Total Credits Owned</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Est. Value: {formatCurrency(2750 * 42.50)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Credits Earned</span>
                        <span className="font-semibold">4,450</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Credits Purchased</span>
                        <span className="font-semibold">750</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Credits Sold</span>
                        <span className="font-semibold">2,450</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => router.push('/project-owner/buy-credits')}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy More Credits
                    </Button>
                    
                    <Button 
                      onClick={() => router.push('/project-owner/purchase-history')}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Purchase History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Help & Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Help & Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Community Forum
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    Best Practices Guide
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
