"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Building2, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Download,
  Edit,
  Trash2,
  Plus,
  Star,
  Clock,
  Globe,
  Phone,
  Mail,
  Award,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";

// Mock data for enterprises
const mockEnterprises = [
  {
    id: 1,
    name: "EcoTech Solutions",
    logo: "/logos/ecotech.png",
    type: "Private Corporation",
    status: "Verified",
    registrationDate: "2023-08-15",
    country: "United States",
    industry: "Environmental Technology",
    website: "https://ecotechsolutions.com",
    email: "contact@ecotechsolutions.com",
    phone: "+1 (555) 123-4567",
    riskScore: "Low",
    creditScore: 850,
    projects: 5,
    totalCreditsIssued: 125000,
    totalCreditsTraded: 98000,
    complianceScore: 95,
    lastActivity: "2024-01-15",
    kycStatus: "Verified",
    certifications: ["ISO 14001", "UNFCCC"],
    description: "Leading environmental technology company specializing in blue carbon projects and sustainable coastal restoration.",
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah.johnson@ecotechsolutions.com",
    transactionHistory: [
      { date: "2024-01-15", type: "Credit Issuance", amount: 25000, project: "Mangrove Restoration" },
      { date: "2024-01-10", type: "Credit Trade", amount: -15000, buyer: "Green Corp" },
      { date: "2024-01-05", type: "Credit Issuance", amount: 18500, project: "Seagrass Conservation" }
    ]
  },
  {
    id: 2,
    name: "Marine Life Foundation",
    logo: "/logos/marine.png",
    type: "Non-Profit Organization",
    status: "Verified",
    registrationDate: "2023-06-20",
    country: "Canada",
    industry: "Marine Conservation",
    website: "https://marinelifefoundation.org",
    email: "info@marinelifefoundation.org",
    phone: "+1 (416) 555-9876",
    riskScore: "Low",
    creditScore: 820,
    projects: 3,
    totalCreditsIssued: 87500,
    totalCreditsTraded: 62000,
    complianceScore: 98,
    lastActivity: "2024-01-12",
    kycStatus: "Verified",
    certifications: ["UNFCCC", "VCS"],
    description: "Non-profit organization dedicated to marine ecosystem preservation and blue carbon project development.",
    contactPerson: "Dr. Michael Chen",
    contactEmail: "m.chen@marinelifefoundation.org",
    transactionHistory: [
      { date: "2024-01-12", type: "Credit Issuance", amount: 18500, project: "Seagrass Initiative" },
      { date: "2024-01-08", type: "Credit Trade", amount: -12000, buyer: "EcoInvest" },
      { date: "2023-12-28", type: "Credit Issuance", amount: 21000, project: "Kelp Forest Protection" }
    ]
  },
  {
    id: 3,
    name: "Coastal Restoration Inc",
    logo: "/logos/coastal.png",
    type: "Private Corporation",
    status: "Under Review",
    registrationDate: "2024-01-01",
    country: "United States",
    industry: "Environmental Consulting",
    website: "https://coastalrestoration.com",
    email: "admin@coastalrestoration.com",
    phone: "+1 (555) 987-6543",
    riskScore: "Medium",
    creditScore: 720,
    projects: 1,
    totalCreditsIssued: 12000,
    totalCreditsTraded: 0,
    complianceScore: 78,
    lastActivity: "2024-01-10",
    kycStatus: "Pending",
    certifications: ["ISO 14001"],
    description: "Environmental consulting firm specializing in coastal restoration and salt marsh rehabilitation projects.",
    contactPerson: "Robert Martinez",
    contactEmail: "robert.martinez@coastalrestoration.com",
    transactionHistory: [
      { date: "2024-01-10", type: "Credit Issuance", amount: 12000, project: "Salt Marsh Recovery" }
    ]
  },
  {
    id: 4,
    name: "Pacific Blue Carbon Co",
    logo: "/logos/pacific.png",
    type: "Private Corporation",
    status: "Suspended",
    registrationDate: "2023-11-10",
    country: "Australia",
    industry: "Carbon Trading",
    website: "https://pacificbluecarbon.com.au",
    email: "contact@pacificbluecarbon.com.au",
    phone: "+61 2 9876 5432",
    riskScore: "High",
    creditScore: 650,
    projects: 2,
    totalCreditsIssued: 45000,
    totalCreditsTraded: 32000,
    complianceScore: 62,
    lastActivity: "2023-12-20",
    kycStatus: "Flagged",
    certifications: [],
    description: "Carbon trading company with focus on blue carbon projects in the Pacific region.",
    contactPerson: "David Wilson",
    contactEmail: "d.wilson@pacificbluecarbon.com.au",
    transactionHistory: [
      { date: "2023-12-20", type: "Credit Trade", amount: -10000, buyer: "Unknown" },
      { date: "2023-12-15", type: "Credit Issuance", amount: 22000, project: "Mangrove Sanctuary" }
    ]
  }
];

export default function AdminEnterprises() {
  const [enterprises, setEnterprises] = useState(mockEnterprises);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedEnterprise, setSelectedEnterprise] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const filteredEnterprises = enterprises.filter(enterprise => {
    const matchesSearch = enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enterprise.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enterprise.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || enterprise.status.toLowerCase() === statusFilter;
    const matchesRisk = riskFilter === "all" || enterprise.riskScore.toLowerCase() === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified": return "bg-green-100 text-green-800 border-green-200";
      case "under review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const handleStatusChange = (enterpriseId: number, newStatus: string) => {
    setEnterprises(prev => prev.map(enterprise => 
      enterprise.id === enterpriseId 
        ? { ...enterprise, status: newStatus }
        : enterprise
    ));
  };

  const viewEnterpriseProfile = (enterpriseId: number) => {
    setSelectedEnterprise(enterpriseId);
  };

  const downloadReport = (enterpriseId: number) => {
    console.log(`Downloading report for enterprise ${enterpriseId}`);
    // Implementation for downloading enterprise report
  };

  const suspendEnterprise = (enterpriseId: number) => {
    if (confirm("Are you sure you want to suspend this enterprise?")) {
      handleStatusChange(enterpriseId, "Suspended");
    }
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
              <Link href="/admin/enterprises" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Enterprises
              </Link>
              <Link href="/admin/analytics" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enterprise Management</h1>
              <p className="text-lg text-gray-600">Monitor and manage registered enterprises</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Enterprise
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: "Total Enterprises", 
                value: enterprises.length, 
                color: "blue",
                icon: Building2
              },
              { 
                label: "Verified", 
                value: enterprises.filter(e => e.status === "Verified").length, 
                color: "green",
                icon: CheckCircle
              },
              { 
                label: "Under Review", 
                value: enterprises.filter(e => e.status === "Under Review").length, 
                color: "yellow",
                icon: Clock
              },
              { 
                label: "High Risk", 
                value: enterprises.filter(e => e.riskScore === "High").length, 
                color: "red",
                icon: AlertTriangle
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={cn("p-2 rounded-lg mr-4",
                        stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                        stat.color === "green" ? "bg-green-100 text-green-600" :
                        stat.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                        "bg-red-100 text-red-600"
                      )}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search enterprises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="under review">Under Review</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <select 
              value={riskFilter} 
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </motion.div>
        </motion.div>

        {/* Enterprises Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredEnterprises.map((enterprise, index) => (
            <motion.div
              key={enterprise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{enterprise.name}</h3>
                        <p className="text-sm text-gray-600">{enterprise.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(enterprise.status)}>
                        {enterprise.status}
                      </Badge>
                      <Badge className={cn("text-xs", getRiskColor(enterprise.riskScore))}>
                        {enterprise.riskScore} Risk
                      </Badge>
                    </div>
                  </div>

                  {/* Enterprise Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{enterprise.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{enterprise.industry}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Since {enterprise.registrationDate}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{enterprise.projects} Projects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{enterprise.totalCreditsIssued.toLocaleString()} Credits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-gray-400" />
                        <span className={cn("text-sm font-medium", getComplianceColor(enterprise.complianceScore))}>
                          {enterprise.complianceScore}% Compliance
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Credit Score & Risk Assessment */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Credit Score</p>
                        <p className="text-xl font-bold text-gray-900">{enterprise.creditScore}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last Activity</p>
                        <p className="text-sm font-medium text-gray-900">{enterprise.lastActivity}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>KYC Status</span>
                        <span className={cn("font-medium", 
                          enterprise.kycStatus === "Verified" ? "text-green-600" :
                          enterprise.kycStatus === "Pending" ? "text-yellow-600" : "text-red-600"
                        )}>
                          {enterprise.kycStatus}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className={cn("h-1 rounded-full transition-all duration-300",
                            enterprise.kycStatus === "Verified" ? "bg-green-500 w-full" :
                            enterprise.kycStatus === "Pending" ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  {enterprise.certifications.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {enterprise.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewEnterpriseProfile(enterprise.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Profile</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadReport(enterprise.id)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Report</span>
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {enterprise.status !== "Suspended" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => suspendEnterprise(enterprise.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <AlertTriangle className="w-3 h-3" />
                        </Button>
                      )}
                      <select 
                        value={enterprise.status} 
                        onChange={(e) => handleStatusChange(enterprise.id, e.target.value)}
                        className="w-32 h-8 text-xs px-2 py-1 border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Verified">Verified</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredEnterprises.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enterprises found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </main>

      {/* Enterprise Profile Modal */}
      <AnimatePresence>
        {selectedEnterprise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEnterprise(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const enterprise = enterprises.find(e => e.id === selectedEnterprise);
                if (!enterprise) return null;

                return (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{enterprise.name}</h2>
                          <p className="text-gray-600">{enterprise.type}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(enterprise.status)}>
                              {enterprise.status}
                            </Badge>
                            <Badge className={cn("text-xs", getRiskColor(enterprise.riskScore))}>
                              {enterprise.riskScore} Risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => setSelectedEnterprise(null)}>
                        ×
                      </Button>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Contact Person</p>
                              <p className="font-medium">{enterprise.contactPerson}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{enterprise.contactEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">{enterprise.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Website</p>
                              <a href={enterprise.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                                {enterprise.website}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Performance Metrics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Credit Score</p>
                              <p className="text-2xl font-bold text-gray-900">{enterprise.creditScore}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Compliance Score</p>
                              <p className={cn("text-2xl font-bold", getComplianceColor(enterprise.complianceScore))}>
                                {enterprise.complianceScore}%
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Total Projects</p>
                              <p className="text-xl font-semibold text-gray-900">{enterprise.projects}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Credits Issued</p>
                              <p className="text-xl font-semibold text-gray-900">{enterprise.totalCreditsIssued.toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Transaction History */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {enterprise.transactionHistory.map((transaction, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                                    transaction.type === "Credit Issuance" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                  )}>
                                    {transaction.type === "Credit Issuance" ? <Plus className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{transaction.type}</p>
                                    <p className="text-sm text-gray-600">{transaction.date}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={cn("font-semibold",
                                    transaction.amount > 0 ? "text-green-600" : "text-blue-600"
                                  )}>
                                    {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString()} Credits
                                  </p>
                                  {transaction.project && (
                                    <p className="text-sm text-gray-600">{transaction.project}</p>
                                  )}
                                  {transaction.buyer && (
                                    <p className="text-sm text-gray-600">to {transaction.buyer}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
