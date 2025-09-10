"use client";

import { motion } from "framer-motion";
import { Filter, Calendar, Globe, Zap } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface FilterState {
  industry: string;
  region: string;
  timeframe: string;
  emissionLevel: string;
}

interface SatelliteFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function SatelliteFilters({ filters, onFiltersChange }: SatelliteFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium text-sm">Filters:</span>
            </div>

            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <Select value={filters.industry} onValueChange={(value) => updateFilter('industry', value)}>
                <SelectTrigger className="w-32 h-8 bg-black/20 border-white/20 text-white text-xs">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="steel">Steel</SelectItem>
                  <SelectItem value="coal">Coal Power</SelectItem>
                  <SelectItem value="cement">Cement</SelectItem>
                  <SelectItem value="oil">Oil & Gas</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-green-400" />
              <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
                <SelectTrigger className="w-28 h-8 bg-black/20 border-white/20 text-white text-xs">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <Select value={filters.timeframe} onValueChange={(value) => updateFilter('timeframe', value)}>
                <SelectTrigger className="w-28 h-8 bg-black/20 border-white/20 text-white text-xs">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last Day</SelectItem>
                  <SelectItem value="7d">Last Week</SelectItem>
                  <SelectItem value="30d">Last Month</SelectItem>
                  <SelectItem value="90d">Last Quarter</SelectItem>
                  <SelectItem value="365d">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-red-400" />
              <Select value={filters.emissionLevel} onValueChange={(value) => updateFilter('emissionLevel', value)}>
                <SelectTrigger className="w-32 h-8 bg-black/20 border-white/20 text-white text-xs">
                  <SelectValue placeholder="Emissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="very-high">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
