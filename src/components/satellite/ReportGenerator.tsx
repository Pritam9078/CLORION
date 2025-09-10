"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileDown, 
  X, 
  FileText, 
  Download,
  Calendar,
  Globe,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface FilterState {
  industry: string;
  region: string;
  timeframe: string;
  emissionLevel: string;
}

interface ReportData {
  industries: Industry[];
  selectedIndustry: Industry | null;
  analysisResults: AnalysisResults | null;
  filters: FilterState;
}

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReportData;
}

export function ReportGenerator({ isOpen, onClose, data }: ReportGeneratorProps) {
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportType, setReportType] = useState("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock report based on the data
    const reportContent = createReportContent();
    downloadReport(reportContent);
    
    setIsGenerating(false);
  };

  const createReportContent = () => {
    const totalEmissions = data.industries.reduce((sum, ind) => sum + ind.co2Tons, 0);
    const avgConfidence = data.industries.reduce((sum, ind) => sum + ind.confidence, 0) / data.industries.length;
    
    return {
      title: "CLORIT Satellite Emission Analysis Report",
      date: new Date().toLocaleDateString(),
      summary: {
        totalIndustries: data.industries.length,
        totalEmissions: totalEmissions,
        averageConfidence: avgConfidence.toFixed(1),
        highRiskFacilities: data.industries.filter(i => i.emissionLevel === "high" || i.emissionLevel === "very-high").length
      },
      industries: data.industries,
      analysisResults: data.analysisResults,
      selectedIndustry: data.selectedIndustry,
      filters: data.filters
    };
  };

  const downloadReport = (reportContent: any) => {
    if (reportFormat === "json") {
      const jsonData = JSON.stringify(reportContent, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `satellite-analysis-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (reportFormat === "csv") {
      const csvData = convertToCSV(data.industries);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `satellite-analysis-report-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For PDF, we'll create an HTML report that can be printed to PDF
      const htmlReport = createHTMLReport(reportContent);
      const blob = new Blob([htmlReport], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `satellite-analysis-report-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const convertToCSV = (industries: Industry[]) => {
    const headers = ['Name', 'Country', 'Emission Level', 'CO2 Tons/Year', 'Confidence %', 'Status', 'Last Analyzed'];
    const rows = industries.map(ind => [
      ind.name,
      ind.country,
      ind.emissionLevel,
      ind.co2Tons,
      ind.confidence,
      ind.status,
      ind.lastAnalyzed
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const createHTMLReport = (reportContent: any) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${reportContent.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #0891b2; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #0891b2; margin-bottom: 10px; }
        .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .metric { display: inline-block; margin: 10px 20px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #0891b2; }
        .metric-label { font-size: 12px; color: #64748b; }
        .industry { margin: 15px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
        .industry-name { font-weight: bold; color: #1e293b; }
        .emission-high { color: #dc2626; }
        .emission-medium { color: #d97706; }
        .emission-low { color: #059669; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CLORIT</div>
        <h1>${reportContent.title}</h1>
        <p>Generated on ${reportContent.date}</p>
    </div>

    <div class="summary">
        <h2>Executive Summary</h2>
        <div class="metric">
            <div class="metric-value">${reportContent.summary.totalIndustries}</div>
            <div class="metric-label">Industries Analyzed</div>
        </div>
        <div class="metric">
            <div class="metric-value">${(reportContent.summary.totalEmissions / 1000).toFixed(0)}k</div>
            <div class="metric-label">Total CO₂ Tons/Year</div>
        </div>
        <div class="metric">
            <div class="metric-value">${reportContent.summary.averageConfidence}%</div>
            <div class="metric-label">Average Confidence</div>
        </div>
        <div class="metric">
            <div class="metric-value">${reportContent.summary.highRiskFacilities}</div>
            <div class="metric-label">High Risk Facilities</div>
        </div>
    </div>

    <h2>Industry Analysis</h2>
    <table>
        <thead>
            <tr>
                <th>Industry Name</th>
                <th>Location</th>
                <th>Emission Level</th>
                <th>CO₂ Tons/Year</th>
                <th>Confidence</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${reportContent.industries.map((ind: Industry) => `
                <tr>
                    <td>${ind.name}</td>
                    <td>${ind.country}</td>
                    <td class="emission-${ind.emissionLevel.includes('high') ? 'high' : ind.emissionLevel === 'medium' ? 'medium' : 'low'}">${ind.emissionLevel.toUpperCase()}</td>
                    <td>${ind.co2Tons.toLocaleString()}</td>
                    <td>${ind.confidence}%</td>
                    <td>${ind.status.toUpperCase()}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    ${reportContent.analysisResults ? `
    <h2>Detailed Analysis Results</h2>
    <div class="summary">
        <p><strong>Emission Score:</strong> ${reportContent.analysisResults.emissionScore}</p>
        <p><strong>CO₂ Estimate:</strong> ${reportContent.analysisResults.co2Estimate}</p>
        <p><strong>Confidence:</strong> ${reportContent.analysisResults.confidence}%</p>
        <p><strong>Hotspots Detected:</strong> ${reportContent.analysisResults.hotspots}</p>
        <p><strong>Plumes Detected:</strong> ${reportContent.analysisResults.plumes}</p>
        <p><strong>Intensity Level:</strong> ${reportContent.analysisResults.intensity}</p>
    </div>
    ` : ''}

    <div class="footer">
        <p>This report was generated by CLORIT Satellite Analysis System</p>
        <p>⚠️ Satellite analysis is AI-estimated and may vary. Results should be verified with ground-truth data.</p>
    </div>
</body>
</html>
    `;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-slate-900 to-blue-900 border border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-transparent border-0 text-white">
              <CardHeader className="border-b border-white/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileDown className="w-5 h-5 text-cyan-400" />
                    <span>Generate Analysis Report</span>
                  </CardTitle>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Report Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                    <div className="text-lg font-bold">{data.industries.length}</div>
                    <div className="text-xs text-slate-400">Industries</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <Zap className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                    <div className="text-lg font-bold">
                      {(data.industries.reduce((sum, ind) => sum + ind.co2Tons, 0) / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-slate-400">CO₂ Tons</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <BarChart3 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                    <div className="text-lg font-bold">
                      {(data.industries.reduce((sum, ind) => sum + ind.confidence, 0) / data.industries.length).toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-400">Avg Confidence</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                    <div className="text-lg font-bold">
                      {data.industries.filter(i => i.emissionLevel === "high" || i.emissionLevel === "very-high").length}
                    </div>
                    <div className="text-xs text-slate-400">High Risk</div>
                  </div>
                </div>

                {/* Report Configuration */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Report Type
                    </label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        <SelectItem value="summary">Executive Summary</SelectItem>
                        <SelectItem value="technical">Technical Details</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Export Format
                    </label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Report Preview */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Report Preview</span>
                  </h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Report Title:</span>
                      <span>CLORIT Satellite Analysis Report</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generated:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="uppercase">{reportFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{reportType.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-white/20 text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-slate-400 text-center pt-4 border-t border-white/10">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Reports are based on AI analysis and should be verified with ground-truth data
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
