"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Settings,
  Share2,
  Download,
  Activity,
  Zap,
  Coins,
  Waves,
  Building2,
  Globe,
  Users,
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Import all the advanced components
import { AIAnalysisSystem } from "@/components/ai/AIAnalysisSystem";
import { NFTTokenizationSystem } from "@/components/nft/NFTTokenizationSystem";
import { BlueCarbonDashboard } from "@/components/blue-carbon/BlueCarbonDashboard";
import { EnhancedProject, BlueCarbon, CarbonCredit } from "@/types/enhanced";

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<EnhancedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate loading project data
    setTimeout(() => {
      setProject(mockEnhancedProject);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Project not found. Please check the URL and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'paused': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'blue_carbon': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      case 'forestry': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'renewable_energy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'agriculture': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Project Details</span>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-muted-foreground text-lg max-w-3xl">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className={getStatusColor(project.status)}>
              {project.status.toUpperCase()}
            </Badge>
            <Badge className={getProjectTypeColor(project.projectType)}>
              {project.projectType.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">
              Scale: {project.scale.toUpperCase()}
            </Badge>
            {project.blueCarbon && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Blue Carbon Certified
              </Badge>
            )}
            {project.tokenization.enabled && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Tokenized
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{project.location.country}, {project.location.region}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {project.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{project.location.area} hectares</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Carbon Sequestered</p>
                  <p className="text-2xl font-bold">{project.metrics.carbonSequestered.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">tCO2e</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  <p className="text-2xl font-bold">${project.metrics.revenueGenerated.toLocaleString()}</p>
                </div>
                <Coins className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Beneficiaries</p>
                  <p className="text-2xl font-bold">{project.metrics.communityBeneficiaries.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sustainability Score</p>
                  <p className="text-2xl font-bold">{project.metrics.sustainabilityScore}/100</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">AI Analysis</TabsTrigger>
            <TabsTrigger value="nft" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">NFT Credits</TabsTrigger>
            <TabsTrigger value="blue-carbon" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Blue Carbon</TabsTrigger>
            <TabsTrigger value="stakeholders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Stakeholders</TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Compliance</TabsTrigger>
            <TabsTrigger value="enterprise" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Enterprise</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.location.country}, {project.location.region}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {project.location.coordinates.latitude.toFixed(4)}, {project.location.coordinates.longitude.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Project Developer</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.stakeholders.projectDeveloper.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {project.stakeholders.projectDeveloper.organization}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Funding Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Funding</span>
                        <span>${project.funding.currentFunding.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Required</span>
                        <span>${project.funding.totalRequired.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(project.funding.currentFunding / project.funding.totalRequired) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {((project.funding.currentFunding / project.funding.totalRequired) * 100).toFixed(1)}% funded
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Carbon Sequestered</p>
                      <p className="text-lg font-bold">{project.metrics.carbonSequestered} tCO2e</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Biodiversity Impact</p>
                      <p className="text-lg font-bold">{project.metrics.biodiversityImpact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Jobs Created</p>
                      <p className="text-lg font-bold">{project.metrics.jobsCreated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Communities</p>
                      <p className="text-lg font-bold">{project.stakeholders.localCommunities.length}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Sustainability Score</h4>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{ width: `${project.metrics.sustainabilityScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.metrics.sustainabilityScore}/100 - Excellent Rating
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'verification', message: 'AI verification completed with 94% confidence', time: '2 hours ago' },
                    { type: 'analysis', message: 'AI analysis completed for sector 3', time: '6 hours ago' },
                    { type: 'credits', message: '250 carbon credit NFTs minted', time: '1 day ago' },
                    { type: 'funding', message: 'Received $50K in funding from Green Fund', time: '3 days ago' }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="min-h-[500px]">
            <AIAnalysisSystem project={project} />
          </TabsContent>

          <TabsContent value="nft" className="min-h-[500px]">
            <NFTTokenizationSystem project={project} />
          </TabsContent>

          <TabsContent value="blue-carbon" className="min-h-[500px]">
            <BlueCarbonDashboard project={project} />
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-6 min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Local Communities</CardTitle>
                  <CardDescription>
                    Communities benefiting from this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.stakeholders.localCommunities.map((community, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{community.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Contact: {community.representativeContact}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {community.benefitShare}% share
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investors</CardTitle>
                  <CardDescription>
                    Project investors and funding sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.stakeholders.investors.map((investor, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{investor.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Investment: ${investor.investmentAmount.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {investor.equityShare}% equity
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6 min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.compliance.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Issued by: {cert.issuer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Valid until: {cert.validUntil.toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.compliance.audits.map((audit, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{audit.auditor}</h4>
                          <p className="text-sm text-muted-foreground">
                            Date: {audit.date.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline"
                            className={
                              audit.result === 'passed' ? 'text-green-600 border-green-200' :
                              audit.result === 'conditional' ? 'text-yellow-600 border-yellow-200' :
                              'text-red-600 border-red-200'
                            }
                          >
                            {audit.result.toUpperCase()}
                          </Badge>
                          <Button variant="outline" size="sm" className="ml-2">
                            <Eye className="h-3 w-3 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-6 min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Corporate Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.enterprise.corporatePartnerships.map((partnership, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{partnership.companyName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {partnership.partnershipType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${partnership.commitmentAmount.toLocaleString()}
                          </p>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Contract
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Supply Chain Integration</span>
                    <Badge variant={project.enterprise.supplyChainIntegration ? "default" : "secondary"}>
                      {project.enterprise.supplyChainIntegration ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Custom Dashboard</span>
                    <Badge variant={project.enterprise.customDashboard ? "default" : "secondary"}>
                      {project.enterprise.customDashboard ? 'Active' : 'Standard'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reporting Frequency</span>
                    <span className="text-sm font-medium capitalize">
                      {project.enterprise.reportingFrequency}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>International Expansion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cross-Border Compliance</span>
                    <Badge variant={project.international.crossBorderCompliance ? "default" : "secondary"}>
                      {project.international.crossBorderCompliance ? 'Compliant' : 'In Progress'}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">International Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.international.internationalStandards.map((standard, idx) => (
                        <Badge key={idx} variant="outline">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Local Partners</h4>
                    <div className="space-y-2">
                      {project.international.localPartners.map((partner, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span>{partner.country}</span>
                          <span className="text-muted-foreground">{partner.partnerName}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Supported Currencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.international.currencySupport.map((currency, idx) => (
                        <Badge key={idx} variant="outline">
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Mock enhanced project data
const mockEnhancedProject: EnhancedProject = {
  id: "project-001",
  name: "Sundarbans Mangrove Restoration Initiative",
  description: "A comprehensive blue carbon project focusing on mangrove restoration, community development, and carbon sequestration in the Sundarbans delta region. This initiative combines cutting-edge satellite monitoring, AI-powered verification, and blockchain-based carbon credit tokenization.",
  projectType: "blue_carbon",
  scale: "large",
  
  location: {
    country: "Bangladesh",
    region: "Khulna Division",
    coordinates: {
      latitude: 22.3569,
      longitude: 89.9506
    },
    boundaries: [
      { latitude: 22.4, longitude: 89.9 },
      { latitude: 22.4, longitude: 90.0 },
      { latitude: 22.3, longitude: 90.0 },
      { latitude: 22.3, longitude: 89.9 }
    ],
    area: 1250
  },

  blueCarbon: {
    ecosystemType: "mangroves",
    marineBiodiversity: {
      speciesCount: 156,
      endangeredSpecies: ["Bengal Tiger", "Irrawaddy Dolphin", "Saltwater Crocodile"],
      biodiversityIndex: 87.3
    },
    oceanHealth: {
      phLevel: 8.1,
      salinity: 32.5,
      temperature: 28.3,
      oxygenLevel: 7.8,
      pollutionLevel: 2.1
    },
    coastalProtection: {
      stormProtection: 92,
      erosionPrevention: 88,
      floodMitigation: 85
    }
  },

  aiAnalysis: [],

  automatedVerification: {
    enabled: true,
    frequency: "daily",
    thresholds: {
      carbonFlux: 2.0,
      waterQuality: 85,
      biodiversity: 80
    },
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },

  carbonCredits: [],

  tokenization: {
    enabled: true,
    tokenStandard: "ERC-1155",
    smartContractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    totalTokensMinted: 2500,
    availableForSale: 1800,
    pricePerToken: 25
  },

  funding: {
    totalRequired: 2500000,
    currentFunding: 1875000,
    fundingSources: [
      {
        source: "Green Climate Fund",
        amount: 1000000,
        type: "grant",
        date: new Date("2024-01-01")
      },
      {
        source: "Private Investors",
        amount: 875000,
        type: "investment",
        date: new Date("2024-02-15")
      }
    ],
    milestones: [
      {
        description: "Phase 1: Site preparation and initial restoration",
        targetDate: new Date("2024-06-30"),
        requiredFunding: 800000,
        status: "completed"
      },
      {
        description: "Phase 2: AI monitoring system deployment and setup",
        targetDate: new Date("2024-09-30"),
        requiredFunding: 500000,
        status: "in_progress"
      }
    ]
  },

  compliance: {
    standards: ["VCS", "CDM", "Gold Standard"],
    certifications: [
      {
        name: "VCS Certification",
        issuer: "Verra",
        validUntil: new Date("2026-12-31"),
        documentUrl: "https://registry.verra.org/certificate/123456"
      }
    ],
    audits: [
      {
        auditor: "Bureau Veritas",
        date: new Date("2024-01-15"),
        result: "passed",
        reportUrl: "https://reports.bureauveritas.com/audit-123456"
      }
    ]
  },

  stakeholders: {
    projectDeveloper: {
      name: "Dr. Aminul Rahman",
      organization: "Bangladesh Mangrove Foundation",
      contact: "aminul.rahman@bmf.org",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678"
    },
    localCommunities: [
      {
        name: "Sundarbans Fishing Community",
        representativeContact: "community@sundarbans.org",
        benefitShare: 25
      },
      {
        name: "Coastal Farmers Association",
        representativeContact: "farmers@coastal.bd",
        benefitShare: 20
      }
    ],
    investors: [
      {
        name: "Green Earth Capital",
        investmentAmount: 500000,
        equityShare: 15,
        walletAddress: "0x9876543210fedcba9876543210fedcba98765432"
      }
    ]
  },

  enterprise: {
    corporatePartnerships: [
      {
        companyName: "Microsoft",
        partnershipType: "Carbon Offset Purchase Agreement",
        commitmentAmount: 1000000,
        contractUrl: "https://contracts.example.com/microsoft-001"
      }
    ],
    supplyChainIntegration: true,
    reportingFrequency: "monthly",
    customDashboard: true
  },

  international: {
    crossBorderCompliance: true,
    internationalStandards: ["ISO 14064", "PAS 2060", "GHG Protocol"],
    localPartners: [
      {
        country: "Bangladesh",
        partnerName: "Department of Environment",
        role: "Regulatory Oversight"
      },
      {
        country: "India",
        partnerName: "Centre for Science and Environment",
        role: "Technical Advisory"
      }
    ],
    currencySupport: ["USD", "EUR", "BDT", "ETH", "USDC"]
  },

  marketplace: {
    listed: true,
    publiclyTradeable: true,
    minimumPurchase: 1,
    maximumPurchase: 1000,
    tradingFees: 2.5,
    liquidityPool: true
  },

  status: "operational",
  metrics: {
    carbonSequestered: 15750,
    biodiversityImpact: 87,
    communityBeneficiaries: 2340,
    jobsCreated: 156,
    revenueGenerated: 875000,
    sustainabilityScore: 94
  },

  createdAt: new Date("2024-01-01"),
  updatedAt: new Date()
};
