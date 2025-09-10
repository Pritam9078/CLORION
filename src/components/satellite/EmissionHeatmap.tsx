"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Download,
  Settings,
  Thermometer,
  Target,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AnalysisResults {
  emissionScore: number;
  co2Estimate: string;
  confidence: number;
  hotspots: number;
  plumes: number;
  intensity: string;
}

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

interface EmissionHeatmapProps {
  results: AnalysisResults;
  uploadedImage: File | null;
  selectedIndustry: Industry | null;
}

export function EmissionHeatmap({ results, uploadedImage, selectedIndustry }: EmissionHeatmapProps) {
  const [overlayOpacity, setOverlayOpacity] = useState([70]);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showPlumes, setShowPlumes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size
        canvas.width = 600;
        canvas.height = 400;
        
        // Draw the uploaded image
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Generate mock overlay effects
        generateHeatmapOverlay(ctx, canvas.width, canvas.height);
      };
      
      img.src = URL.createObjectURL(uploadedImage);
    }
  }, [uploadedImage, overlayOpacity, showHeatmap, showHotspots, showPlumes]);

  const generateHeatmapOverlay = (ctx: CanvasRenderingContext2D | null, width: number, height: number) => {
    if (!ctx) return;

    // Create overlay based on analysis results
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = overlayOpacity[0] / 100;

    // Generate heatmap areas
    if (showHeatmap) {
      for (let i = 0; i < results.hotspots; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = 30 + Math.random() * 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Generate plume effects
    if (showPlumes) {
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < results.plumes; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        ctx.strokeStyle = 'rgba(200, 200, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 50, y - 30, x + 100, y - 60);
        ctx.stroke();
      }
    }

    // Generate hotspot markers
    if (showHotspots) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      
      for (let i = 0; i < results.hotspots; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        // Draw targeting crosshair
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x + 20, y);
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y + 20);
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `emission-analysis-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const resetView = () => {
    setZoom(100);
    setOverlayOpacity([70]);
    setShowHeatmap(true);
    setShowHotspots(true);
    setShowPlumes(true);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Emission Heatmap Analysis</span>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400">
              AI Enhanced
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={resetView}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              onClick={downloadImage}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className="relative bg-black/20 rounded-lg p-4 border border-white/10">
              {uploadedImage ? (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto rounded-lg border border-white/20"
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                  />
                  
                  {/* Overlay Info */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Badge className="bg-black/70 text-cyan-300 border-cyan-400">
                      Score: {results.emissionScore}
                    </Badge>
                    <Badge className="bg-black/70 text-green-300 border-green-400">
                      Confidence: {results.confidence}%
                    </Badge>
                  </div>

                  {/* Analysis Legend */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <h4 className="text-white font-semibold mb-2 text-sm">Legend</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-white">High Emissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-white">Medium Emissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                        <span className="text-white">Hotspots</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-1 bg-blue-400 rounded"></div>
                        <span className="text-white">Plumes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Thermometer className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Upload satellite image to see heatmap analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Layer Controls */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Layer Controls</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Heatmap</span>
                  <Button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-6 w-12 p-0 border-white/20",
                      showHeatmap ? "bg-cyan-500 border-cyan-400" : "bg-gray-600"
                    )}
                  >
                    {showHeatmap ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Hotspots</span>
                  <Button
                    onClick={() => setShowHotspots(!showHotspots)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-6 w-12 p-0 border-white/20",
                      showHotspots ? "bg-cyan-500 border-cyan-400" : "bg-gray-600"
                    )}
                  >
                    {showHotspots ? <Target className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Plumes</span>
                  <Button
                    onClick={() => setShowPlumes(!showPlumes)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-6 w-12 p-0 border-white/20",
                      showPlumes ? "bg-cyan-500 border-cyan-400" : "bg-gray-600"
                    )}
                  >
                    {showPlumes ? <Wind className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Opacity Control */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm">Overlay Opacity</label>
              <Slider
                value={overlayOpacity}
                onValueChange={setOverlayOpacity}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="text-center text-xs text-slate-400">
                {overlayOpacity[0]}%
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
              <label className="text-white font-semibold text-sm">Zoom</label>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <span className="text-xs text-slate-300 flex-1 text-center">
                  {zoom}%
                </span>
                <Button
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <h4 className="text-white font-semibold text-sm">Detection Summary</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hotspots:</span>
                  <span className="text-red-400">{results.hotspots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plumes:</span>
                  <span className="text-blue-400">{results.plumes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Intensity:</span>
                  <span className="text-yellow-400 capitalize">{results.intensity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. CO₂:</span>
                  <span className="text-orange-400">{results.co2Estimate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
