import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Waves,
  Fish,
  Thermometer,
  Droplets,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Activity,
  BarChart3,
  Eye,
  Leaf,
  TreePine,
  Anchor,
  Globe,
  Heart
} from 'lucide-react';
import { BlueCarbon, EnhancedProject } from '@/types/enhanced';

interface BlueCarbonDashboardProps {
  project: EnhancedProject;
}

interface OceanHealthMetrics {
  waterQuality: number;
  biodiversityIndex: number;
  ecosystemStability: number;
  carbonStorage: number;
  coastalProtection: number;
  communityBenefit: number;
}

export const BlueCarbonDashboard: React.FC<BlueCarbonDashboardProps> = ({ project }) => {
  const [blueCarbon, setBlueCarbon] = useState<BlueCarbon | null>(null);
  const [oceanMetrics, setOceanMetrics] = useState<OceanHealthMetrics>({
    waterQuality: 0,
    biodiversityIndex: 0,
    ecosystemStability: 0,
    carbonStorage: 0,
    coastalProtection: 0,
    communityBenefit: 0
  });
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>('overview');

  useEffect(() => {
    if (project.blueCarbon) {
      setBlueCarbon(project.blueCarbon);
      
      // Calculate ocean health metrics
      const metrics: OceanHealthMetrics = {
        waterQuality: calculateWaterQuality(project.blueCarbon.oceanHealth),
        biodiversityIndex: project.blueCarbon.marineBiodiversity.biodiversityIndex,
        ecosystemStability: 85, // Mock calculation
        carbonStorage: 92, // Mock calculation based on ecosystem type
        coastalProtection: project.blueCarbon.coastalProtection.stormProtection,
        communityBenefit: 78 // Mock calculation
      };
      
      setOceanMetrics(metrics);
    }
  }, [project]);

  const calculateWaterQuality = (oceanHealth: BlueCarbon['oceanHealth']) => {
    // Simple water quality index calculation
    const phScore = Math.max(0, 100 - Math.abs(oceanHealth.phLevel - 8.1) * 20);
    const oxygenScore = Math.min(100, (oceanHealth.oxygenLevel / 8) * 100);
    const pollutionScore = Math.max(0, 100 - oceanHealth.pollutionLevel * 10);
    
    return Math.round((phScore + oxygenScore + pollutionScore) / 3);
  };

  const getEcosystemIcon = (type: string) => {
    switch (type) {
      case 'mangroves': return <TreePine className="h-5 w-5 text-green-600" />;
      case 'seagrass': return <Leaf className="h-5 w-5 text-green-500" />;
      case 'salt_marshes': return <Waves className="h-5 w-5 text-blue-500" />;
      case 'kelp_forests': return <Anchor className="h-5 w-5 text-teal-500" />;
      case 'coral_reefs': return <Heart className="h-5 w-5 text-pink-500" />;
      default: return <Globe className="h-5 w-5 text-blue-400" />;
    }
  };

  const getEcosystemDescription = (type: string) => {
    const descriptions = {
      mangroves: 'Coastal forests that store massive amounts of carbon in their roots and sediments',
      seagrass: 'Underwater meadows that sequester carbon 35x faster than tropical rainforests',
      salt_marshes: 'Coastal wetlands that provide storm protection and carbon storage',
      kelp_forests: 'Giant algae ecosystems that rapidly absorb CO2 from seawater',
      coral_reefs: 'Biodiversity hotspots that support marine life and coastal protection'
    };
    return descriptions[type as keyof typeof descriptions] || 'Marine ecosystem supporting carbon sequestration';
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit = '%', 
    icon: Icon, 
    color = 'text-blue-500',
    trend,
    description
  }: {
    title: string;
    value: number;
    unit?: string;
    icon: any;
    color?: string;
    trend?: number;
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-sm font-medium">{title}</span>
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+{trend.toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{value.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          
          <Progress value={value} className="h-2" />
          
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EcosystemOverview = () => {
    if (!blueCarbon) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {getEcosystemIcon(blueCarbon.ecosystemType)}
              <div>
                <CardTitle className="capitalize">
                  {blueCarbon.ecosystemType.replace('_', ' ')} Ecosystem
                </CardTitle>
                <CardDescription>
                  {getEcosystemDescription(blueCarbon.ecosystemType)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Carbon Storage Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">2.8</span>
                  <span className="text-sm text-muted-foreground">tCO2e/ha/year</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Ecosystem Area</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">{project.location.area}</span>
                  <span className="text-sm text-muted-foreground">hectares</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Protection Level</span>
                <div className="flex items-center gap-2">
                  <Progress value={oceanMetrics.coastalProtection} className="flex-1" />
                  <span className="text-sm font-medium">{oceanMetrics.coastalProtection}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Water Quality"
            value={oceanMetrics.waterQuality}
            icon={Droplets}
            color="text-blue-500"
            trend={2.3}
            description="pH, oxygen, and pollution levels"
          />
          
          <MetricCard
            title="Biodiversity Index"
            value={oceanMetrics.biodiversityIndex}
            icon={Fish}
            color="text-green-500"
            trend={5.7}
            description="Species richness and abundance"
          />
          
          <MetricCard
            title="Carbon Storage"
            value={oceanMetrics.carbonStorage}
            icon={Leaf}
            color="text-emerald-500"
            trend={8.2}
            description="Total carbon sequestration capacity"
          />
          
          <MetricCard
            title="Ecosystem Stability"
            value={oceanMetrics.ecosystemStability}
            icon={Shield}
            color="text-purple-500"
            trend={1.8}
            description="Resilience to environmental changes"
          />
          
          <MetricCard
            title="Coastal Protection"
            value={oceanMetrics.coastalProtection}
            icon={Waves}
            color="text-cyan-500"
            trend={3.4}
            description="Storm surge and erosion protection"
          />
          
          <MetricCard
            title="Community Benefit"
            value={oceanMetrics.communityBenefit}
            icon={Heart}
            color="text-pink-500"
            trend={12.1}
            description="Local economic and social impact"
          />
        </div>
      </div>
    );
  };

  const MarineBiodiversity = () => {
    if (!blueCarbon) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Species Diversity</CardTitle>
              <CardDescription>
                Marine life supported by this ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Species Count</span>
                  <span className="text-lg font-bold">{blueCarbon.marineBiodiversity.speciesCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Biodiversity Index</span>
                  <div className="flex items-center gap-2">
                    <Progress value={blueCarbon.marineBiodiversity.biodiversityIndex} className="w-20" />
                    <span className="text-sm font-medium">
                      {blueCarbon.marineBiodiversity.biodiversityIndex.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Ecosystem Health Indicators</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Fish Population', value: 87 },
                      { name: 'Coral Health', value: 72 },
                      { name: 'Water Clarity', value: 94 },
                      { name: 'Nutrient Balance', value: 81 }
                    ].map((indicator, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between mb-1">
                          <span>{indicator.name}</span>
                          <span>{indicator.value}%</span>
                        </div>
                        <Progress value={indicator.value} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endangered Species</CardTitle>
              <CardDescription>
                Protected species within the project area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blueCarbon.marineBiodiversity.endangeredSpecies.length > 0 ? (
                  blueCarbon.marineBiodiversity.endangeredSpecies.map((species, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Fish className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{species}</span>
                      </div>
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        Endangered
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-muted-foreground">
                      No endangered species documented in this area
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Species Monitoring</CardTitle>
            <CardDescription>
              Real-time tracking of key marine species
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sea Turtles', count: 23, trend: 'up', status: 'stable' },
                { name: 'Juvenile Fish', count: 847, trend: 'up', status: 'growing' },
                { name: 'Coral Colonies', count: 156, trend: 'neutral', status: 'stable' },
                { name: 'Seabird Nests', count: 34, trend: 'up', status: 'growing' },
                { name: 'Marine Mammals', count: 8, trend: 'neutral', status: 'stable' }
              ].map((species, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Fish className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">{species.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Population: {species.count}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={
                        species.status === 'growing' ? 'text-green-600 border-green-200' :
                        species.status === 'stable' ? 'text-blue-600 border-blue-200' :
                        'text-red-600 border-red-200'
                      }
                    >
                      {species.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-3 w-3 ${
                        species.trend === 'up' ? 'text-green-500' :
                        species.trend === 'down' ? 'text-red-500' :
                        'text-gray-500'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const OceanHealth = () => {
    if (!blueCarbon) return null;

    const { oceanHealth } = blueCarbon;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">pH Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">{oceanHealth.phLevel.toFixed(2)}</div>
                <Progress value={((oceanHealth.phLevel - 7) / 2) * 100} />
                <div className="text-xs text-muted-foreground">
                  Optimal range: 7.8 - 8.3
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{oceanHealth.temperature}</span>
                  <span className="text-sm text-muted-foreground">°C</span>
                </div>
                <Progress value={(oceanHealth.temperature / 35) * 100} />
                <div className="text-xs text-muted-foreground">
                  Seasonal variation tracked
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Salinity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{oceanHealth.salinity}</span>
                  <span className="text-sm text-muted-foreground">ppt</span>
                </div>
                <Progress value={(oceanHealth.salinity / 40) * 100} />
                <div className="text-xs text-muted-foreground">
                  Within normal range
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Oxygen Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{oceanHealth.oxygenLevel}</span>
                  <span className="text-sm text-muted-foreground">mg/L</span>
                </div>
                <Progress value={(oceanHealth.oxygenLevel / 10) * 100} />
                <div className="text-xs text-muted-foreground">
                  Healthy oxygen levels
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pollution Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">{oceanHealth.pollutionLevel.toFixed(1)}</div>
                <Progress value={oceanHealth.pollutionLevel * 10} />
                <div className="text-xs text-muted-foreground">
                  Lower is better
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Water Quality Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">{oceanMetrics.waterQuality}</div>
                <Progress value={oceanMetrics.waterQuality} />
                <div className="text-xs text-muted-foreground">
                  Composite health score
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {oceanHealth.pollutionLevel > 5 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Pollution levels are elevated. Increased monitoring and mitigation measures recommended.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Environmental Monitoring Trends</CardTitle>
            <CardDescription>
              Historical data and trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p>Environmental trend charts would be displayed here</p>
                <p className="text-xs">Showing pH, temperature, oxygen, and pollution trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const CoastalProtection = () => {
    if (!blueCarbon) return null;

    const { coastalProtection } = blueCarbon;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Storm Protection"
            value={coastalProtection.stormProtection}
            icon={Shield}
            color="text-blue-600"
            description="Protection against storm surges"
          />
          
          <MetricCard
            title="Erosion Prevention"
            value={coastalProtection.erosionPrevention}
            icon={Waves}
            color="text-teal-600"
            description="Coastal erosion mitigation"
          />
          
          <MetricCard
            title="Flood Mitigation"
            value={coastalProtection.floodMitigation}
            icon={Droplets}
            color="text-cyan-600"
            description="Flood risk reduction"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Protection Services Value</CardTitle>
            <CardDescription>
              Economic value of ecosystem services provided
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Annual Economic Benefits</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Storm damage prevented</span>
                    <span className="font-medium">$2.3M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Property value protection</span>
                    <span className="font-medium">$1.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Infrastructure savings</span>
                    <span className="font-medium">$950K</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-2">
                    <span>Total Annual Value</span>
                    <span>$5.05M</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Communities Protected</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Households</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Businesses</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Critical infrastructure</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Agricultural land (ha)</span>
                    <span className="font-medium">456</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>
              Climate change and sea level rise impact analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  risk: 'Sea Level Rise',
                  level: 'Medium',
                  impact: 'Potential 15% reduction in protection by 2050',
                  mitigation: 'Ecosystem restoration and adaptive management'
                },
                {
                  risk: 'Extreme Weather Events',
                  level: 'High',
                  impact: 'Increased storm intensity may stress ecosystem',
                  mitigation: 'Enhanced monitoring and early warning systems'
                },
                {
                  risk: 'Ocean Acidification',
                  level: 'Medium',
                  impact: 'May affect coral and shell-forming organisms',
                  mitigation: 'pH monitoring and local pollution reduction'
                },
                {
                  risk: 'Coastal Development',
                  level: 'Low',
                  impact: 'Protected status limits development pressure',
                  mitigation: 'Continued conservation enforcement'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.risk}</h4>
                    <Badge 
                      variant="outline"
                      className={
                        item.level === 'High' ? 'text-red-600 border-red-200' :
                        item.level === 'Medium' ? 'text-yellow-600 border-yellow-200' :
                        'text-green-600 border-green-200'
                      }
                    >
                      {item.level} Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.impact}</p>
                  <p className="text-xs font-medium">Mitigation: {item.mitigation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!blueCarbon) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Waves className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Blue Carbon Data</h3>
          <p className="text-muted-foreground">
            This project doesn't have blue carbon ecosystem data configured.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blue Carbon Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Waves className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle>Blue Carbon Ecosystem</CardTitle>
                <CardDescription>
                  Marine and coastal carbon sequestration monitoring
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View on Map
              </Button>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Live Data
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedEcosystem} onValueChange={setSelectedEcosystem} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
          <TabsTrigger value="ocean-health">Ocean Health</TabsTrigger>
          <TabsTrigger value="protection">Coastal Protection</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <EcosystemOverview />
        </TabsContent>

        <TabsContent value="biodiversity">
          <MarineBiodiversity />
        </TabsContent>

        <TabsContent value="ocean-health">
          <OceanHealth />
        </TabsContent>

        <TabsContent value="protection">
          <CoastalProtection />
        </TabsContent>
      </Tabs>
    </div>
  );
};
