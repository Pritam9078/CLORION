import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye,
  BarChart3,
  Zap,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AIAnalysis, EnhancedProject } from '@/types/enhanced';

interface AIAnalysisSystemProps {
  project: EnhancedProject;
}

export const AIAnalysisSystem: React.FC<AIAnalysisSystemProps> = ({ project }) => {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState<string | null>(null);
  const [autoVerificationEnabled, setAutoVerificationEnabled] = useState(
    project.automatedVerification.enabled
  );

  useEffect(() => {
    // Load existing analyses
    setAnalyses(project.aiAnalysis || mockAnalyses);
  }, [project]);

  const runAnalysis = async (type: string) => {
    setRunningAnalysis(type);
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newAnalysis: AIAnalysis = {
        id: `analysis-${Date.now()}`,
        projectId: project.id,
        analysisType: type as any,
        algorithm: getAlgorithmForType(type),
        confidence: 0.85 + Math.random() * 0.15,
        results: generateMockResults(type),
        createdAt: new Date(),
        modelVersion: '2.1.3'
      };
      
      setAnalyses(prev => [newAnalysis, ...prev]);
      setRunningAnalysis(null);
      setLoading(false);
    }, 3000);
  };

  const getAlgorithmForType = (type: string): string => {
    const algorithms = {
      carbon_sequestration: 'Random Forest + LSTM',
      ecosystem_health: 'CNN + Ensemble Methods',
      biodiversity: 'Deep Learning + Species Recognition',
      prediction: 'Time Series Forecasting',
      verification: 'Multi-Modal Verification'
    };
    return algorithms[type as keyof typeof algorithms] || 'Machine Learning';
  };

  const generateMockResults = (type: string) => {
    switch (type) {
      case 'carbon_sequestration':
        return {
          carbonSequestration: {
            dailyRate: 2.3 + Math.random() * 1.5,
            projectedAnnual: 850 + Math.random() * 200,
            uncertainty: 0.05 + Math.random() * 0.1
          }
        };
      case 'ecosystem_health':
        return {
          ecosystemHealth: {
            score: 75 + Math.random() * 20,
            trends: ['Increasing biomass', 'Stable water quality', 'Growing biodiversity'],
            riskFactors: ['Climate change', 'Human activity nearby']
          }
        };
      case 'prediction':
        return {
          predictions: {
            timeframe: '5 years',
            scenarios: [
              { name: 'Best case', probability: 0.3, impact: 120 },
              { name: 'Expected', probability: 0.5, impact: 100 },
              { name: 'Worst case', probability: 0.2, impact: 75 }
            ]
          }
        };
      default:
        return {};
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-blue-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const AnalysisCard = ({ analysis }: { analysis: AIAnalysis }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-sm font-medium">
              {analysis.analysisType.replace('_', ' ').toUpperCase()}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getConfidenceColor(analysis.confidence)}>
              {getConfidenceLabel(analysis.confidence)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {analysis.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
        <CardDescription>
          Model: {analysis.algorithm} v{analysis.modelVersion}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <div className="flex items-center gap-2">
              <Progress value={analysis.confidence * 100} className="w-20" />
              <span className="text-sm font-medium">
                {(analysis.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {analysis.results.carbonSequestration && (
            <div className="space-y-2">
              <h4 className="font-medium">Carbon Sequestration Analysis</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Daily Rate:</span>
                  <p className="font-medium">
                    {analysis.results.carbonSequestration.dailyRate.toFixed(2)} tCO2e/day
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Projected Annual:</span>
                  <p className="font-medium">
                    {analysis.results.carbonSequestration.projectedAnnual.toFixed(0)} tCO2e/year
                  </p>
                </div>
              </div>
            </div>
          )}

          {analysis.results.ecosystemHealth && (
            <div className="space-y-2">
              <h4 className="font-medium">Ecosystem Health Score</h4>
              <div className="flex items-center gap-2">
                <Progress value={analysis.results.ecosystemHealth.score} />
                <span className="font-medium">
                  {analysis.results.ecosystemHealth.score.toFixed(0)}/100
                </span>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Key Trends:</p>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.results.ecosystemHealth.trends.map((trend, idx) => (
                    <li key={idx} className="text-green-600">{trend}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {analysis.results.predictions && (
            <div className="space-y-2">
              <h4 className="font-medium">Predictions ({analysis.results.predictions.timeframe})</h4>
              <div className="space-y-2">
                {analysis.results.predictions.scenarios.map((scenario, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{scenario.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={scenario.probability * 100} className="w-16" />
                      <span className="w-8 text-right">{(scenario.probability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AutoVerificationPanel = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <CardTitle>Automated Verification</CardTitle>
          </div>
          <Button
            variant={autoVerificationEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoVerificationEnabled(!autoVerificationEnabled)}
          >
            {autoVerificationEnabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
        <CardDescription>
          AI-powered continuous monitoring and verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {autoVerificationEnabled && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Automated verification is running. Next check in 2 hours.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Verification Frequency</span>
              <select className="w-full p-2 border rounded">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Threshold Sensitivity</span>
              <select className="w-full p-2 border rounded">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Verification Metrics</h4>
            <div className="space-y-2">
              {[
                { name: 'Carbon Flux Accuracy', value: 94 },
                { name: 'Satellite Data Quality', value: 97 },
                { name: 'Satellite Correlation', value: 89 },
                { name: 'Methodology Compliance', value: 92 }
              ].map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={metric.value} className="w-20" />
                    <span className="text-sm font-medium w-8">{metric.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* AI Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">{analyses.length}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">
                  {analyses.length > 0 
                    ? (analyses.reduce((acc, a) => acc + a.confidence, 0) / analyses.length * 100).toFixed(0)
                    : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto Verification</p>
                <p className="text-2xl font-bold">
                  {autoVerificationEnabled ? 'ON' : 'OFF'}
                </p>
              </div>
              <Zap className={`h-8 w-8 ${autoVerificationEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Analysis</p>
                <p className="text-2xl font-bold">
                  {analyses.length > 0 ? '2h' : 'N/A'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analyses" className="w-full">
        <TabsList>
          <TabsTrigger value="analyses">AI Analyses</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analyses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Run New Analysis</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => runAnalysis('carbon_sequestration')}
                disabled={loading}
                size="sm"
              >
                {runningAnalysis === 'carbon_sequestration' && (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                )}
                Carbon Analysis
              </Button>
              <Button
                onClick={() => runAnalysis('ecosystem_health')}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {runningAnalysis === 'ecosystem_health' && (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                )}
                Ecosystem Health
              </Button>
              <Button
                onClick={() => runAnalysis('prediction')}
                disabled={loading}
                size="sm"
                variant="outline"
              >
                {runningAnalysis === 'prediction' && (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                )}
                Predictions
              </Button>
            </div>
          </div>

          {loading && runningAnalysis && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Running {runningAnalysis.replace('_', ' ')} analysis... This may take a few minutes.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {analyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>

          {analyses.length === 0 && !loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Analyses Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Run your first AI analysis to get insights about your project
                </p>
                <Button onClick={() => runAnalysis('carbon_sequestration')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation">
          <AutoVerificationPanel />
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AI Models & Algorithms</CardTitle>
              <CardDescription>
                Advanced machine learning models powering the analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Carbon Sequestration Model',
                    algorithm: 'Random Forest + LSTM',
                    accuracy: 94,
                    lastUpdated: '2024-01-15'
                  },
                  {
                    name: 'Ecosystem Health Model',
                    algorithm: 'CNN + Ensemble Methods',
                    accuracy: 91,
                    lastUpdated: '2024-01-10'
                  },
                  {
                    name: 'Biodiversity Assessment',
                    algorithm: 'Deep Learning + Species Recognition',
                    accuracy: 88,
                    lastUpdated: '2024-01-12'
                  },
                  {
                    name: 'Predictive Analytics',
                    algorithm: 'Time Series Forecasting',
                    accuracy: 86,
                    lastUpdated: '2024-01-08'
                  }
                ].map((model, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-muted-foreground">{model.algorithm}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={model.accuracy} className="w-20" />
                        <span className="text-sm font-medium">{model.accuracy}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Updated {model.lastUpdated}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Carbon Sequestration Trending Up
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        15% increase in carbon capture rate over the last month
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Ecosystem Health Stable
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        All key indicators within normal ranges
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                        Weather Pattern Changes
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Monitor for potential impact on growth rates
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Increase Monitoring Density</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add 3-4 more monitoring points in the northwestern section for better coverage
                    </p>
                    <Badge variant="outline">High Priority</Badge>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Optimize Monitoring Schedule</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Increase measurement frequency during growth season
                    </p>
                    <Badge variant="outline">Medium Priority</Badge>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">Community Engagement</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Involve local communities in monitoring activities
                    </p>
                    <Badge variant="outline">Low Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mock data for demonstration
const mockAnalyses: AIAnalysis[] = [
  {
    id: 'analysis-001',
    projectId: 'project-001',
    analysisType: 'carbon_sequestration',
    algorithm: 'Random Forest + LSTM',
    confidence: 0.94,
    results: {
      carbonSequestration: {
        dailyRate: 2.8,
        projectedAnnual: 1023,
        uncertainty: 0.08
      }
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    modelVersion: '2.1.3'
  },
  {
    id: 'analysis-002',
    projectId: 'project-001',
    analysisType: 'ecosystem_health',
    algorithm: 'CNN + Ensemble Methods',
    confidence: 0.89,
    results: {
      ecosystemHealth: {
        score: 87,
        trends: ['Increasing biomass density', 'Stable soil moisture', 'Growing species diversity'],
        riskFactors: ['Seasonal temperature variations', 'Nearby development activities']
      }
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    modelVersion: '2.0.8'
  }
];
