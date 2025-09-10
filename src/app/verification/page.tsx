"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Camera, 
  Satellite,
  AlertCircle,
  Download,
  Upload,
  Eye,
  MessageSquare,
  User,
  Building,
  Leaf,
  Zap,
  Star
} from "lucide-react";
import { cn, formatNumber, formatDate, getEcosystemColor } from "@/lib/utils";
import { mockUser } from "@/data/mockUser";

// Mock projects for verification
const mockProjects = [
  {
    id: "1",
    name: "Sundarbans Mangrove Restoration",
    owner: "Green Earth Foundation",
    location: "Bangladesh",
    ecosystemType: "MANGROVE",
    area: 1250,
    status: "PENDING_VERIFICATION",
    submittedDate: "2024-03-01",
    documents: 12,
    satelliteImages: 8,
    estimatedCredits: 2500,
    projectType: "Restoration",
    priority: "HIGH",
    description: "Large-scale mangrove restoration project in the Sundarbans delta region focusing on community-based conservation and livelihood improvement.",
    methodology: "Verra VCS VM0007",
    verificationDeadline: "2024-03-15",
    previousVerifications: 0,
    complianceScore: 85
  },
  {
    id: "2",
    name: "Coastal Wetland Protection",
    owner: "Ocean Conservation Trust",
    location: "Philippines",
    ecosystemType: "WETLAND",
    area: 800,
    status: "IN_REVIEW",
    submittedDate: "2024-02-20",
    documents: 15,
    satelliteImages: 12,
    estimatedCredits: 1800,
    projectType: "Conservation",
    priority: "MEDIUM",
    description: "Protection and enhancement of coastal wetland ecosystems with focus on biodiversity conservation and community engagement.",
    methodology: "Gold Standard AMS-III.F",
    verificationDeadline: "2024-03-10",
    previousVerifications: 1,
    complianceScore: 92
  },
  {
    id: "3",
    name: "Seagrass Meadow Restoration",
    owner: "Marine Ecology Institute",
    location: "Australia",
    ecosystemType: "SEAGRASS",
    area: 950,
    status: "VERIFIED",
    submittedDate: "2024-02-01",
    documents: 18,
    satelliteImages: 15,
    estimatedCredits: 1200,
    projectType: "Restoration",
    priority: "LOW",
    description: "Restoration of degraded seagrass meadows in Shark Bay using innovative transplantation techniques and community monitoring.",
    methodology: "Climate Action Reserve",
    verificationDeadline: "2024-02-28",
    previousVerifications: 2,
    complianceScore: 96,
    verifiedDate: "2024-02-25",
    issuedCredits: 1150
  }
];

const statusColors = {
  PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
  IN_REVIEW: "bg-blue-100 text-blue-800 border-blue-200",
  VERIFIED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200"
};

const priorityColors = {
  HIGH: "bg-red-100 text-red-800 border-red-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-green-100 text-green-800 border-green-200"
};

export default function VerificationPage() {
  const [user] = useState(mockUser);
  const [projects] = useState(mockProjects);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState("");

  const filteredProjects = projects.filter(project => {
    if (selectedStatus === "ALL") return true;
    return project.status === selectedStatus;
  });

  const handleStartVerification = (project: any) => {
    setSelectedProject(project);
    setVerificationNotes("");
  };

  const handleCompleteVerification = (approved: boolean) => {
    const action = approved ? "approved" : "rejected";
    console.log(`Project ${selectedProject.id} ${action}:`, {
      notes: verificationNotes,
      verifier: user.name
    });
    alert(`Project ${action} successfully! (Demo mode)`);
    setSelectedProject(null);
  };

  // Stats
  const totalProjects = projects.length;
  const pendingProjects = projects.filter(p => p.status === "PENDING_VERIFICATION").length;
  const verifiedProjects = projects.filter(p => p.status === "VERIFIED").length;
  const averageScore = projects.reduce((sum, p) => sum + p.complianceScore, 0) / projects.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Project Verification Dashboard
          </h1>
          <p className="text-gray-600">
            Review and verify blue carbon projects for credit issuance
          </p>
        </div>

        {/* Verifier Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingProjects}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">{verifiedProjects}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-purple-600">{averageScore.toFixed(1)}%</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verifier Profile Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.experience} of verification experience</p>
                <div className="flex gap-2 mt-2">
                  {user.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Verification Status</p>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Certified Verifier
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium text-gray-900">Filter Projects</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedStatus("ALL")}
                  variant={selectedStatus === "ALL" ? "default" : "outline"}
                  size="sm"
                >
                  All ({totalProjects})
                </Button>
                <Button
                  onClick={() => setSelectedStatus("PENDING_VERIFICATION")}
                  variant={selectedStatus === "PENDING_VERIFICATION" ? "default" : "outline"}
                  size="sm"
                >
                  Pending ({pendingProjects})
                </Button>
                <Button
                  onClick={() => setSelectedStatus("IN_REVIEW")}
                  variant={selectedStatus === "IN_REVIEW" ? "default" : "outline"}
                  size="sm"
                >
                  In Review
                </Button>
                <Button
                  onClick={() => setSelectedStatus("VERIFIED")}
                  variant={selectedStatus === "VERIFIED" ? "default" : "outline"}
                  size="sm"
                >
                  Verified ({verifiedProjects})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                        {project.priority} Priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {project.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted {formatDate(project.submittedDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(project.estimatedCredits)}
                    </div>
                    <div className="text-sm text-gray-500">Credits Estimated</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Project Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getEcosystemColor(project.ecosystemType)}>
                        {project.ecosystemType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Area: </span>
                      <span className="font-medium">{formatNumber(project.area)} ha</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Documents: </span>
                      <span className="font-medium">{project.documents}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Methodology: </span>
                      <span className="font-medium">{project.methodology}</span>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Compliance Score */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Compliance Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full",
                              project.complianceScore >= 90 ? "bg-green-500" :
                              project.complianceScore >= 70 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${project.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {project.complianceScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deadline and Status Info */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Deadline: {formatDate(project.verificationDeadline)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Satellite className="w-4 h-4" />
                        {project.satelliteImages} satellite images
                      </div>
                      {project.previousVerifications > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {project.previousVerifications} prev. verification(s)
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Documents
                      </Button>
                      {project.status === "PENDING_VERIFICATION" && (
                        <Button 
                          onClick={() => handleStartVerification(project)}
                          variant="gradient"
                          size="sm"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Start Verification
                        </Button>
                      )}
                      {project.status === "VERIFIED" && (
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Verified Project Additional Info */}
                  {project.status === "VERIFIED" && project.verifiedDate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Verified on {formatDate(project.verifiedDate)}
                          </span>
                        </div>
                        <div className="text-sm text-green-700">
                          <span className="font-medium">{formatNumber(project.issuedCredits!)} credits issued</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verification Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verify Project: {selectedProject.name}
                </CardTitle>
                <CardDescription>
                  Complete the verification process for this blue carbon project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Project Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Project Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Owner: </span>
                        <span className="font-medium">{selectedProject.owner}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location: </span>
                        <span className="font-medium">{selectedProject.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Area: </span>
                        <span className="font-medium">{formatNumber(selectedProject.area)} ha</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Methodology: </span>
                        <span className="font-medium">{selectedProject.methodology}</span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Verification Checklist</h4>
                    <div className="space-y-2">
                      {[
                        "Project documentation complete",
                        "Baseline calculations verified",
                        "Monitoring plan adequate",
                        "Additionality demonstrated",
                        "Permanence measures in place",
                        "Community engagement documented",
                        "Environmental safeguards met"
                      ].map((item, index) => (
                        <label key={index} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verification Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Notes
                    </label>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your verification notes, findings, and recommendations..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setSelectedProject(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleCompleteVerification(false)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleCompleteVerification(true)}
                      variant="gradient"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Shield className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">
                No projects match the selected filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
