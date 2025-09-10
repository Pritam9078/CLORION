"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Building2,
  Download,
  MoreVertical,
  ArrowUpDown,
  ChevronDown,
  Badge as BadgeIcon,
  MessageSquare,
  FileCheck,
  ExternalLink,
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

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    name: "Mangrove Restoration Project",
    owner: "EcoTech Solutions",
    status: "pending",
    category: "Mangrove",
    submissionDate: "2024-01-15",
    lastUpdated: "2024-01-16",
    location: "Gulf Coast, Florida",
    area: "1,250 hectares",
    expectedCredits: 25000,
    description: "Large-scale mangrove restoration project aimed at protecting coastal areas and enhancing carbon sequestration.",
    documents: ["Project Proposal.pdf", "Environmental Assessment.pdf", "Site Survey.pdf"],
    riskScore: "Low",
    compliance: "Pending Review"
  },
  {
    id: 2,
    name: "Seagrass Conservation Initiative",
    owner: "Marine Life Foundation",
    status: "approved",
    category: "Seagrass",
    submissionDate: "2024-01-12",
    lastUpdated: "2024-01-14",
    location: "Chesapeake Bay, Maryland",
    area: "850 hectares",
    expectedCredits: 18500,
    description: "Protection and restoration of critical seagrass habitats to support marine biodiversity.",
    documents: ["Conservation Plan.pdf", "Monitoring Protocol.pdf", "Baseline Study.pdf"],
    riskScore: "Low",
    compliance: "Approved"
  },
  {
    id: 3,
    name: "Salt Marsh Recovery",
    owner: "Coastal Restoration Inc",
    status: "pending",
    category: "Salt Marsh",
    submissionDate: "2024-01-10",
    lastUpdated: "2024-01-15",
    location: "San Francisco Bay, California",
    area: "450 hectares",
    expectedCredits: 12000,
    description: "Comprehensive salt marsh restoration to improve water quality and coastal resilience.",
    documents: ["Restoration Plan.pdf", "Permit Applications.pdf"],
    riskScore: "Medium",
    compliance: "Documentation Incomplete"
  },
  {
    id: 4,
    name: "Kelp Forest Protection",
    owner: "Ocean Conservation Trust",
    status: "rejected",
    category: "Kelp Forest",
    submissionDate: "2024-01-08",
    lastUpdated: "2024-01-13",
    location: "Monterey Bay, California",
    area: "2,100 hectares",
    expectedCredits: 35000,
    description: "Protection and enhancement of kelp forest ecosystems along the Pacific Coast.",
    documents: ["Project Overview.pdf"],
    riskScore: "High",
    compliance: "Non-compliant"
  },
  {
    id: 5,
    name: "Wetland Restoration Initiative",
    owner: "Green Earth Solutions",
    status: "approved",
    category: "Wetland",
    submissionDate: "2024-01-05",
    lastUpdated: "2024-01-12",
    location: "Everglades, Florida",
    area: "3,200 hectares",
    expectedCredits: 48000,
    description: "Large-scale wetland restoration project to improve water filtration and wildlife habitat.",
    documents: ["Master Plan.pdf", "Environmental Impact.pdf", "Monitoring Strategy.pdf", "Compliance Report.pdf"],
    riskScore: "Low",
    compliance: "Fully Compliant"
  }
];

type FilterStatus = "all" | "approved" | "pending" | "rejected";
type SortOption = "name" | "date" | "owner" | "credits";

export default function AdminProjects() {
  const [projects, setProjects] = useState(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(project => project.status === filterStatus);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortBy === "date") {
        aValue = new Date(a.submissionDate);
        bValue = new Date(b.submissionDate);
      } else if (sortBy === "credits") {
        aValue = a.expectedCredits;
        bValue = b.expectedCredits;
      } else if (sortBy === "name") {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === "owner") {
        aValue = a.owner;
        bValue = b.owner;
      } else {
        aValue = a.submissionDate;
        bValue = b.submissionDate;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filterStatus, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("desc");
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", 
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={cn("backdrop-blur-sm border-b sticky top-0 z-50",
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
              )}>CLORIT Admin</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/dashboard" className={cn("font-medium transition-colors",
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              )}>
                Dashboard
              </Link>
              <Link href="/admin/projects" className={cn("font-medium transition-colors",
                isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
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
              {/* Profile Dropdown */}
              <ProfileDropdown isDarkMode={isDarkMode} />
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h1>
              <p className="text-lg text-gray-600">Review and manage carbon credit projects</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Projects", value: projects.length, color: "blue" },
              { label: "Approved", value: projects.filter(p => p.status === "approved").length, color: "green" },
              { label: "Pending Review", value: projects.filter(p => p.status === "pending").length, color: "yellow" },
              { label: "Rejected", value: projects.filter(p => p.status === "rejected").length, color: "red" }
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
                        <FileText className="w-5 h-5" />
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
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search projects by name, owner, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="owner">Sort by Owner</option>
                    <option value="credits">Sort by Credits</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">{project.status}</span>
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Owner</p>
                        <p className="font-medium text-gray-900">{project.owner}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{project.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Submitted</p>
                        <p className="font-medium text-gray-900">{project.submissionDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Expected Credits</p>
                        <p className="font-medium text-gray-900">{project.expectedCredits.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Risk:</span>
                        <Badge className={cn("text-xs", getRiskColor(project.riskScore))}>
                          {project.riskScore}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Area:</span>
                        <span className="text-sm font-medium text-gray-900">{project.area}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Category:</span>
                        <Badge className="bg-blue-50 text-blue-700 text-xs">{project.category}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/projects/${project.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </Button>
                      </Link>
                      {project.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
