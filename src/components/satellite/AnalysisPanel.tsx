"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  MapPin,
  Calendar,
  BarChart3,
  Eye,
  Target,
  Thermometer,
  Wind,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

interface AnalysisResults {
  emissionScore: number;
  co2Estimate: string;
  confidence: number;
  hotspots: number;
  plumes: number;
  intensity: string;
}

interface AnalysisPanelProps {
  selectedIndustry: Industry | null;
  uploadedImage: File | null;
  onImageUpload: (file: File) => void;
  analysisProgress: number;
  isAnalyzing: boolean;
  analysisResults: AnalysisResults | null;
  onAnalyze: () => void;
}

export function AnalysisPanel({ 
  selectedIndustry, 
  uploadedImage, 
  onImageUpload, 
  analysisProgress, 
  isAnalyzing, 
  analysisResults,
  onAnalyze 
}: AnalysisPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const getEmissionColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-orange-400";
      case "very-high": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getEmissionBadgeColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500/20 text-green-300 border-green-400";
      case "medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-400";
      case "high": return "bg-orange-500/20 text-orange-300 border-orange-400";
      case "very-high": return "bg-red-500/20 text-red-300 border-red-400";
      default: return "bg-gray-500/20 text-gray-300 border-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Industry Info */}
      {selectedIndustry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Selected Industry</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedIndustry.name}</h3>
                  <p className="text-slate-300">{selectedIndustry.country}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Emission Level</p>
                    <Badge className={getEmissionBadgeColor(selectedIndustry.emissionLevel)}>
                      {selectedIndustry.emissionLevel.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <Badge className={cn(
                      selectedIndustry.status === "active" 
                        ? "bg-green-500/20 text-green-300 border-green-400"
                        : "bg-blue-500/20 text-blue-300 border-blue-400"
                    )}>
                      {selectedIndustry.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Annual Emissions</span>
                    <span className={cn("font-semibold", getEmissionColor(selectedIndustry.emissionLevel))}>
                      {selectedIndustry.co2Tons.toLocaleString()} tons
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Confidence</span>
                    <span className="text-green-400 font-semibold">{selectedIndustry.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Last Analyzed</span>
                    <span className="text-slate-300">{selectedIndustry.lastAnalyzed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Image Upload */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <span>Satellite Image Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
              dragActive 
                ? "border-cyan-400 bg-cyan-400/10" 
                : "border-slate-600 hover:border-slate-500",
              uploadedImage && "border-green-400 bg-green-400/10"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {uploadedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <div>
                  <p className="text-white font-semibold">{uploadedImage.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Upload Different Image
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className={cn(
                  "w-12 h-12 mx-auto",
                  dragActive ? "text-cyan-400" : "text-slate-400"
                )} />
                <div>
                  <p className="text-white font-semibold">
                    {dragActive ? "Drop image here" : "Upload satellite image"}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Drag and drop or click to select
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <span>Analysis Results</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-400">
                  Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Main Score */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-white">
                        {analysisResults.emissionScore}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {analysisResults.confidence}%
                    </div>
                  </div>
                  <p className="text-white font-semibold">Emission Score</p>
                  <p className="text-slate-400 text-sm">AI Confidence: {analysisResults.confidence}%</p>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-slate-400">CO₂ Estimate</span>
                    </div>
                    <p className="text-lg font-bold text-orange-400">{analysisResults.co2Estimate}</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-slate-400">Hotspots</span>
                    </div>
                    <p className="text-lg font-bold text-red-400">{analysisResults.hotspots}</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wind className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-400">Plumes</span>
                    </div>
                    <p className="text-lg font-bold text-blue-400">{analysisResults.plumes}</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-slate-400">Intensity</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-400 capitalize">{analysisResults.intensity}</p>
                  </div>
                </div>

                {/* Analysis Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Detection Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Smoke Plumes", value: 85, color: "bg-red-500" },
                      { label: "Heat Signatures", value: 92, color: "bg-orange-500" },
                      { label: "Chemical Markers", value: 78, color: "bg-yellow-500" },
                      { label: "Atmospheric Disturbance", value: 88, color: "bg-blue-500" }
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-white">{item.value}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={cn("h-2 rounded-full", item.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>Processing Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={analysisProgress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{analysisProgress.toFixed(0)}%</span>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-cyan-400">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-sm">AI processing in progress...</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Button */}
      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing || (!uploadedImage && !selectedIndustry)}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 h-12"
      >
        {isAnalyzing ? (
          <>
            <Activity className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Run AI Analysis
          </>
        )}
      </Button>
    </div>
  );
}
