"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Satellite, 
  Upload, 
  Play, 
  FileDown, 
  Filter,
  Globe,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  MapPin,
  TrendingUp,
  Eye,
  Layers,
  Download,
  RefreshCw,
  Settings,
  Camera,
  Scan
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { RouteProtection } from "@/components/RouteProtection";
import { Header } from "@/components/Header";
import { Globe3D } from "@/components/satellite/Globe3D";
import { AnalysisPanel } from "@/components/satellite/AnalysisPanel";
import { SatelliteFilters } from "@/components/satellite/SatelliteFilters";
import { ReportGenerator } from "@/components/satellite/ReportGenerator";
import { EmissionHeatmap } from "@/components/satellite/EmissionHeatmap";

// Industry interface to match the components
interface Industry {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  country: string;
  emissionLevel: "low" | "medium" | "high" | "very-high";
  co2Tons: number;
  lastAnalyzed: string;
  status: "active" | "monitoring" | "inactive";
  confidence: number;
}

// Mock data for industries
const mockIndustries: Industry[] = [
  {
    id: "1",
    name: "Steel Manufacturing Plant",
    location: { lat: 40.7128, lng: -74.0060 },
    country: "USA",
    emissionLevel: "high",
    co2Tons: 125000,
    lastAnalyzed: "2024-12-08",
    status: "active",
    confidence: 94
  },
  {
    id: "2", 
    name: "Coal Power Station",
    location: { lat: 51.5074, lng: -0.1278 },
    country: "UK",
    emissionLevel: "very-high",
    co2Tons: 250000,
    lastAnalyzed: "2024-12-07",
    status: "active",
    confidence: 98
  },
  {
    id: "3",
    name: "Cement Factory",
    location: { lat: 35.6762, lng: 139.6503 },
    country: "Japan",
    emissionLevel: "medium",
    co2Tons: 75000,
    lastAnalyzed: "2024-12-06",
    status: "monitoring",
    confidence: 87
  },
  {
    id: "4",
    name: "Oil Refinery",
    location: { lat: 29.7604, lng: -95.3698 },
    country: "USA",
    emissionLevel: "high",
    co2Tons: 180000,
    lastAnalyzed: "2024-12-08",
    status: "active",
    confidence: 92
  },
  {
    id: "5",
    name: "Chemical Plant",
    location: { lat: 52.5200, lng: 13.4050 },
    country: "Germany",
    emissionLevel: "medium",
    co2Tons: 95000,
    lastAnalyzed: "2024-12-05",
    status: "monitoring",
    confidence: 89
  }
];

export default function SatelliteAnalysisPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [filters, setFilters] = useState({
    industry: "all",
    region: "all",
    timeframe: "7d",
    emissionLevel: "all"
  });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showReport, setShowReport] = useState(false);

  const { user } = useAuth();

  // Simulate analysis progress
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsAnalyzing(false);
            setAnalysisResults({
              emissionScore: 87,
              co2Estimate: "142,000 tons/year",
              confidence: 94,
              hotspots: 12,
              plumes: 3,
              intensity: "high"
            });
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setAnalysisResults(null);
    setAnalysisProgress(0);
  };

  const runAnalysis = () => {
    if (!uploadedImage && !selectedIndustry) {
      alert("Please select an industry or upload a satellite image first.");
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
  };

  const filteredIndustries = mockIndustries.filter(industry => {
    if (filters.industry !== "all" && !industry.name.toLowerCase().includes(filters.industry)) return false;
    if (filters.region !== "all" && industry.country !== filters.region) return false;
    if (filters.emissionLevel !== "all" && industry.emissionLevel !== filters.emissionLevel) return false;
    return true;
  });

  const totalEmissions = filteredIndustries.reduce((sum, industry) => sum + industry.co2Tons, 0);
  const averageConfidence = filteredIndustries.reduce((sum, industry) => sum + industry.confidence, 0) / filteredIndustries.length;

  return (
    <RouteProtection allowedRoles={["ADMIN", "VERIFIER"]} redirectTo="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <Header user={user} />
        
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-10 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
          </div>
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-75 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl">
                    <Satellite className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Satellite Carbon Emission Analysis
                  </h1>
                  <p className="text-slate-400 mt-1">AI-powered emission detection and monitoring</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowReport(true)}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Total Industries</p>
                      <p className="text-2xl font-bold text-cyan-400">{filteredIndustries.length}</p>
                    </div>
                    <Globe className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Total Emissions</p>
                      <p className="text-2xl font-bold text-orange-400">{(totalEmissions / 1000).toFixed(0)}k tons</p>
                    </div>
                    <Zap className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Avg Confidence</p>
                      <p className="text-2xl font-bold text-green-400">{averageConfidence.toFixed(0)}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Active Monitoring</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {filteredIndustries.filter(i => i.status === "active").length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <SatelliteFilters filters={filters} onFiltersChange={setFilters} />
          </motion.div>

          {/* Main Content - Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - 3D Globe */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-[600px]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>Global Industry Monitor</span>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400">
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[520px]">
                  <Globe3D
                    industries={filteredIndustries}
                    selectedIndustry={selectedIndustry}
                    onIndustrySelect={setSelectedIndustry}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Panel - Analysis Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AnalysisPanel
                selectedIndustry={selectedIndustry}
                uploadedImage={uploadedImage}
                onImageUpload={handleImageUpload}
                analysisProgress={analysisProgress}
                isAnalyzing={isAnalyzing}
                analysisResults={analysisResults}
                onAnalyze={runAnalysis}
              />
            </motion.div>
          </div>

          {/* Analysis Progress & Results */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Scan className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span>AI Analysis in Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <div className={cn("text-2xl font-bold", analysisProgress > 20 ? "text-green-400" : "text-slate-400")}>
                          {analysisProgress > 20 ? "✓" : "..."}
                        </div>
                        <p className="text-sm text-slate-300">Image Processing</p>
                      </div>
                      <div className="space-y-2">
                        <div className={cn("text-2xl font-bold", analysisProgress > 60 ? "text-green-400" : "text-slate-400")}>
                          {analysisProgress > 60 ? "✓" : "..."}
                        </div>
                        <p className="text-sm text-slate-300">AI Detection</p>
                      </div>
                      <div className="space-y-2">
                        <div className={cn("text-2xl font-bold", analysisProgress > 90 ? "text-green-400" : "text-slate-400")}>
                          {analysisProgress > 90 ? "✓" : "..."}
                        </div>
                        <p className="text-sm text-slate-300">Report Generation</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Emission Heatmap */}
          {analysisResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <EmissionHeatmap
                results={analysisResults}
                uploadedImage={uploadedImage}
                selectedIndustry={selectedIndustry}
              />
            </motion.div>
          )}
        </main>

        {/* Footer Disclaimer */}
        <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>
                Satellite analysis is AI-estimated and may vary. Results should be verified with ground-truth data.
              </span>
            </div>
            <div className="flex items-center justify-center mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500">Powered by</span>
                <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CLORIT
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </footer>

        {/* Report Generator Modal */}
        <ReportGenerator 
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          data={{
            industries: filteredIndustries,
            selectedIndustry,
            analysisResults,
            filters
          }}
        />
      </div>
    </RouteProtection>
  );
}
