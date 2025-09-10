"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

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

interface Globe3DProps {
  industries: Industry[];
  selectedIndustry: Industry | null;
  onIndustrySelect: (industry: Industry) => void;
}

export function Globe3D({ industries, selectedIndustry, onIndustrySelect }: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);

  // Globe configuration
  useEffect(() => {
    if (globeRef.current && globeReady) {
      const globe = globeRef.current;
      
      // Initial globe position and controls
      globe.pointOfView({ altitude: 2.5 });
      globe.controls().enableZoom = true;
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    }
  }, [globeReady]);

  // Focus on selected industry
  useEffect(() => {
    if (selectedIndustry && globeRef.current && globeReady) {
      globeRef.current.pointOfView({
        lat: selectedIndustry.location.lat,
        lng: selectedIndustry.location.lng,
        altitude: 1.5
      }, 1000);
    }
  }, [selectedIndustry, globeReady]);

  const getEmissionColor = (level: string) => {
    switch (level) {
      case "low": return "#10B981"; // green
      case "medium": return "#F59E0B"; // yellow
      case "high": return "#EF4444"; // red
      case "very-high": return "#DC2626"; // dark red
      default: return "#6B7280"; // gray
    }
  };

  const getEmissionSize = (level: string) => {
    switch (level) {
      case "low": return 0.8;
      case "medium": return 1.2;
      case "high": return 1.6;
      case "very-high": return 2.0;
      default: return 1.0;
    }
  };

  const handlePointClick = (point: any) => {
    const industry = industries.find(ind => ind.id === point.id);
    if (industry) {
      onIndustrySelect(industry);
    }
  };

  const customPointLabel = (point: any) => {
    const industry = industries.find(ind => ind.id === point.id);
    if (!industry) return "";
    
    return `
      <div style="
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid ${getEmissionColor(industry.emissionLevel)};
        border-radius: 8px;
        padding: 12px;
        color: white;
        font-family: system-ui;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        min-width: 250px;
      ">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="
            width: 12px;
            height: 12px;
            background: ${getEmissionColor(industry.emissionLevel)};
            border-radius: 50%;
            margin-right: 8px;
            box-shadow: 0 0 10px ${getEmissionColor(industry.emissionLevel)};
          "></div>
          <strong style="color: #06B6D4;">${industry.name}</strong>
        </div>
        
        <div style="margin-bottom: 4px;">
          <span style="color: #94A3B8;">Location:</span> ${industry.country}
        </div>
        
        <div style="margin-bottom: 4px;">
          <span style="color: #94A3B8;">Emissions:</span> 
          <span style="color: ${getEmissionColor(industry.emissionLevel)};">
            ${industry.co2Tons.toLocaleString()} tons/year
          </span>
        </div>
        
        <div style="margin-bottom: 4px;">
          <span style="color: #94A3B8;">Level:</span> 
          <span style="
            color: ${getEmissionColor(industry.emissionLevel)};
            text-transform: capitalize;
            font-weight: bold;
          ">${industry.emissionLevel.replace('-', ' ')}</span>
        </div>
        
        <div style="margin-bottom: 4px;">
          <span style="color: #94A3B8;">Confidence:</span> 
          <span style="color: #10B981;">${industry.confidence}%</span>
        </div>
        
        <div>
          <span style="color: #94A3B8;">Last Analyzed:</span> ${industry.lastAnalyzed}
        </div>
        
        <div style="
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #374151;
          font-size: 11px;
          color: #6B7280;
        ">
          Click to view detailed analysis
        </div>
      </div>
    `;
  };

  // Transform industries into globe points
  const globePoints = industries.map(industry => ({
    ...industry,
    lat: industry.location.lat,
    lng: industry.location.lng,
    color: getEmissionColor(industry.emissionLevel),
    size: getEmissionSize(industry.emissionLevel)
  }));

  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading 3D Globe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-900/50 rounded-lg overflow-hidden">
      {!globeReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Initializing Globe...</p>
          </div>
        </div>
      )}
      
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        pointsData={globePoints}
        pointAltitude={0.02}
        pointRadius={(point: any) => {
          const isSelected = selectedIndustry?.id === point.id;
          return isSelected ? point.size * 1.5 : point.size;
        }}
        pointColor={(point: any) => {
          const isSelected = selectedIndustry?.id === point.id;
          if (isSelected) {
            return "#00FFFF"; // Bright cyan for selected
          }
          return point.color;
        }}
        pointsMerge={false}
        pointLabel={customPointLabel}
        onPointClick={handlePointClick}
        
        // Atmosphere
        atmosphereColor="#06B6D4"
        atmosphereAltitude={0.15}
        
        // Animation and interaction
        animateIn={true}
        waitForGlobeReady={true}
        onGlobeReady={() => setGlobeReady(true)}
        
        // Additional visual effects
        pointsTransitionDuration={1000}
      />
      
      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20"
      >
        <h4 className="text-white font-semibold mb-3 text-sm">Emission Levels</h4>
        <div className="space-y-2">
          {[
            { level: "Low", color: "#10B981", range: "< 50k tons" },
            { level: "Medium", color: "#F59E0B", range: "50k - 100k tons" },
            { level: "High", color: "#EF4444", range: "100k - 200k tons" },
            { level: "Very High", color: "#DC2626", range: "> 200k tons" }
          ].map((item) => (
            <div key={item.level} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}`
                }}
              />
              <span className="text-white">{item.level}</span>
              <span className="text-slate-400">({item.range})</span>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Controls Info */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20"
      >
        <h4 className="text-white font-semibold mb-2 text-sm">Controls</h4>
        <div className="space-y-1 text-xs text-slate-300">
          <div>• Drag to rotate</div>
          <div>• Scroll to zoom</div>
          <div>• Click markers for details</div>
          <div>• Auto-rotation enabled</div>
        </div>
      </motion.div>
    </div>
  );
}
