"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Filter,
  Search,
  Download,
  Upload
} from "lucide-react";
import { cn, formatNumber, formatCurrency, formatDate, getStatusColor, getEcosystemColor } from "@/lib/utils";
import { mockUser } from "@/data/mockUser";

// Use consistent mock user data

// Mock projects data
const mockProjects = [
  {
    id: "1",
    name: "Sundarbans Mangrove Restoration",
    description: "Large-scale mangrove restoration project in the Sundarbans delta region focusing on biodiversity conservation and carbon sequestration.",
    location: "Bangladesh",
    area: 1250,
    ecosystemType: "MANGROVE",
    status: "VERIFIED",
    co2Captured: 15000,
    estimatedCO2: 18000,
    creditsIssued: 12000,
    creditsAvailable: 8000,
    startDate: "2024-01-15",
    endDate: "2027-01-15",
    createdAt: "2024-01-15",
    owner: "Green Earth Foundation"
  },
  {
    id: "2",
    name: "Coastal Seagrass Protection",
    description: "Protection and restoration of critical seagrass beds along the coastal areas to enhance marine biodiversity and carbon storage.",
    location: "Philippines",
    area: 850,
    ecosystemType: "SEAGRASS",
    status: "UNDER_REVIEW",
    co2Captured: 0,
    estimatedCO2: 8500,
    creditsIssued: 0,
    creditsAvailable: 0,
    startDate: "2024-03-20",
    endDate: "2026-03-20",
    createdAt: "2024-03-20",
    owner: "Ocean Conservation Society"
  },
  {
    id: "3",
    name: "Wetland Ecosystem Restoration",
    description: "Comprehensive wetland restoration program aimed at restoring natural hydrology and native vegetation.",
    location: "Vietnam",
    area: 2100,
    ecosystemType: "WETLAND",
    status: "ACTIVE",
    co2Captured: 5200,
    estimatedCO2: 12000,
    creditsIssued: 4000,
    creditsAvailable: 3200,
    startDate: "2023-08-10",
    endDate: "2026-08-10",
    createdAt: "2023-08-10",
    owner: "Vietnam Environmental Trust"
  },
  {
    id: "4",
    name: "Salt Marsh Conservation",
    description: "Protection of existing salt marsh ecosystems and enhancement of their carbon sequestration capacity.",
    location: "California, USA",
    area: 675,
    ecosystemType: "SALT_MARSH",
    status: "SUBMITTED",
    co2Captured: 0,
    estimatedCO2: 4500,
    creditsIssued: 0,
    creditsAvailable: 0,
    startDate: "2024-05-01",
    endDate: "2027-05-01",
    createdAt: "2024-04-15",
    owner: "Pacific Coast Conservancy"
  }
];

export default function ProjectsPage() {
  const [user] = useState(mockUser);
  const [projects] = useState(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ecosystemFilter, setEcosystemFilter] = useState("ALL");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || project.status === statusFilter;
    const matchesEcosystem = ecosystemFilter === "ALL" || project.ecosystemType === ecosystemFilter;
    
    return matchesSearch && matchesStatus && matchesEcosystem;
  });

  const getActionButtons = (project: any) => {
    const buttons = [];
    
    if (user.role === "PROJECT_OWNER" && project.status === "DRAFT") {
      buttons.push(
        <Button key="edit" size="sm" variant="outline">
          Edit
        </Button>
      );
    }
    
    if (user.role === "VERIFIER" && project.status === "SUBMITTED") {
      buttons.push(
        <Button key="review" size="sm" variant="outline">
          Review
        </Button>
      );
    }
    
    buttons.push(
      <Button key="view" size="sm" variant="ghost">
        <Eye className="w-4 h-4 mr-1" />
        View Details
      </Button>
    );
    
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Blue Carbon Projects
            </h1>
            <p className="text-gray-600">
              {user.role === "PROJECT_OWNER" && "Manage your blue carbon restoration projects"}
              {user.role === "VERIFIER" && "Review and verify submitted projects, oversee all projects in the system"}
              {user.role === "TRADER" && "Explore verified projects for credit trading"}
            </p>
          </div>
          
          {user.role === "PROJECT_OWNER" && (
            <Button className="flex items-center gap-2" variant="gradient">
              <Plus className="w-4 h-4" />
              Register New Project
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Ecosystem Filter */}
              <div className="lg:w-48">
                <select
                  value={ecosystemFilter}
                  onChange={(e) => setEcosystemFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Ecosystems</option>
                  <option value="MANGROVE">Mangrove</option>
                  <option value="SEAGRASS">Seagrass</option>
                  <option value="WETLAND">Wetland</option>
                  <option value="SALT_MARSH">Salt Marsh</option>
                </select>
              </div>

              {/* Export Button */}
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getEcosystemColor(project.ecosystemType)}>
                        {project.ecosystemType.replace('_', ' ')}
                      </Badge>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Location and Area */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    <span className="text-sm font-medium">{formatNumber(project.area)} ha</span>
                  </div>

                  {/* CO2 Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">CO₂ Captured</p>
                      <p className="font-semibold text-green-600">
                        {formatNumber(project.co2Captured)}t
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credits Issued</p>
                      <p className="font-semibold text-blue-600">
                        {formatNumber(project.creditsIssued)}
                      </p>
                    </div>
                  </div>

                  {/* Project Timeline */}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                  </div>

                  {/* Owner */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Owner:</span> {project.owner}
                  </div>

                  {/* Progress Bar for Active Projects */}
                  {project.status === "ACTIVE" && project.estimatedCO2 > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((project.co2Captured / project.estimatedCO2) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((project.co2Captured / project.estimatedCO2) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {getActionButtons(project)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              {user.role === "PROJECT_OWNER" && (
                <Button variant="gradient" className="flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Register Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
            <CardDescription>Overview of all projects in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(projects.reduce((sum, p) => sum + p.area, 0))}ha
                </p>
                <p className="text-sm text-gray-600">Total Area</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber(projects.reduce((sum, p) => sum + p.co2Captured, 0))}t
                </p>
                <p className="text-sm text-gray-600">CO₂ Captured</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(projects.reduce((sum, p) => sum + p.creditsIssued, 0))}
                </p>
                <p className="text-sm text-gray-600">Credits Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
