import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Shield,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Leaf,
  Waves,
  TreePine,
  Link
} from 'lucide-react';
import { EnhancedProject, GlobalConfiguration } from '@/types/enhanced';
import { BlockchainDashboard } from '@/components/blockchain/BlockchainDashboard';
import { useBlockchainData } from '@/hooks/useBlockchain';

interface EnterpriseDashboardProps {
  projects: EnhancedProject[];
  configuration: GlobalConfiguration;
}

interface EnterpriseMetrics {
  totalProjects: number;
  activeProjects: number;
  totalCarbonSequestered: number;
  totalRevenue: number;
  totalInvestors: number;
  totalBeneficiaries: number;
  complianceScore: number;
  sustainabilityRating: number;
  marketCapitalization: number;
  portfolioGrowth: number;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ 
  projects, 
  configuration 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<EnterpriseMetrics>({
    totalProjects: 0,
    activeProjects: 0,
    totalCarbonSequestered: 0,
    totalRevenue: 0,
    totalInvestors: 0,
    totalBeneficiaries: 0,
    complianceScore: 0,
    sustainabilityRating: 0,
    marketCapitalization: 0,
    portfolioGrowth: 0
  });

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('30d');

  useEffect(() => {
    // Calculate enterprise metrics
    const calculatedMetrics: EnterpriseMetrics = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'operational').length,
      totalCarbonSequestered: projects.reduce((acc, p) => acc + p.metrics.carbonSequestered, 0),
      totalRevenue: projects.reduce((acc, p) => acc + p.metrics.revenueGenerated, 0),
      totalInvestors: projects.reduce((acc, p) => acc + p.stakeholders.investors.length, 0),
      totalBeneficiaries: projects.reduce((acc, p) => acc + p.metrics.communityBeneficiaries, 0),
      complianceScore: projects.reduce((acc, p) => acc + p.metrics.sustainabilityScore, 0) / projects.length,
      sustainabilityRating: 87, // Mock calculated rating
      marketCapitalization: projects.reduce((acc, p) => acc + (p.tokenization.totalTokensMinted * p.tokenization.pricePerToken), 0),
      portfolioGrowth: 15.3 // Mock growth percentage
    };
    
    setMetrics(calculatedMetrics);
  }, [projects]);

  const MetricCard = ({ 
    title, 
    value, 
    unit = '', 
    change, 
    icon: Icon, 
    trend = 'up' 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    change?: number;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span className={`text-xs ${
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 
                  'text-gray-500'
                }`}>
                  {change > 0 && '+'}
                  {change.toFixed(1)}% from last period
                </span>
              </div>
            )}
          </div>
          <Icon className="h-8 w-8 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  );

  const ProjectTypeBreakdown = () => {
    const blueCarbon = projects.filter(p => p.projectType === 'blue_carbon').length;
    const forestry = projects.filter(p => p.projectType === 'forestry').length;
    const renewable = projects.filter(p => p.projectType === 'renewable_energy').length;
    const agriculture = projects.filter(p => p.projectType === 'agriculture').length;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>Distribution by project type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Blue Carbon</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(blueCarbon / projects.length) * 100} className="w-20" />
                <span className="text-sm font-medium">{blueCarbon}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TreePine className="h-4 w-4 text-green-500" />
                <span className="text-sm">Forestry</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(forestry / projects.length) * 100} className="w-20" />
                <span className="text-sm font-medium">{forestry}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Renewable Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(renewable / projects.length) * 100} className="w-20" />
                <span className="text-sm font-medium">{renewable}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm">Agriculture</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(agriculture / projects.length) * 100} className="w-20" />
                <span className="text-sm font-medium">{agriculture}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Projects</span>
              <span className="font-medium">{projects.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const GlobalExpansionStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle>Global Expansion</CardTitle>
        <CardDescription>International presence and compliance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Countries</span>
            </div>
            <p className="text-2xl font-bold">{configuration.supportedCountries.length}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Currencies</span>
            </div>
            <p className="text-2xl font-bold">{configuration.supportedCurrencies.length}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Compliance Frameworks</h4>
          <div className="flex flex-wrap gap-2">
            {configuration.complianceFrameworks.map((framework, idx) => (
              <Badge key={idx} variant="outline">
                {framework}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Strategic Partnerships</h4>
          <div className="space-y-2">
            {configuration.partnerships.slice(0, 3).map((partnership, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">{partnership.name}</p>
                  <p className="text-xs text-muted-foreground">{partnership.type}</p>
                </div>
                <Badge variant="outline">{partnership.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ScalabilityMetrics = () => (
    <Card>
      <CardHeader>
        <CardTitle>Platform Scalability</CardTitle>
        <CardDescription>System capacity and performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Projects</span>
              <span className="text-sm font-medium">
                {configuration.scalabilityMetrics.maxProjectsSupported.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={(projects.length / configuration.scalabilityMetrics.maxProjectsSupported) * 100} 
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">TPS Capacity</span>
              <span className="text-sm font-medium">
                {configuration.scalabilityMetrics.maxTransactionsPerSecond.toLocaleString()}
              </span>
            </div>
            <Progress value={35} /> {/* Mock current usage */}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Users</span>
              <span className="text-sm font-medium">
                {configuration.scalabilityMetrics.maxUsersSupported.toLocaleString()}
              </span>
            </div>
            <Progress value={18} /> {/* Mock current usage */}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm font-medium">
                {configuration.scalabilityMetrics.dataStorageCapacity}
              </span>
            </div>
            <Progress value={42} /> {/* Mock current usage */}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">System operating within optimal parameters</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RecentActivity = () => {
    const activities = [
      {
        type: 'project_created',
        message: 'New blue carbon project launched in Indonesia',
        time: '2 hours ago',
        icon: Waves,
        color: 'text-blue-500'
      },
      {
        type: 'verification_complete',
        message: 'AI verification completed for Project #1234',
        time: '4 hours ago',
        icon: CheckCircle,
        color: 'text-green-500'
      },
      {
        type: 'tokens_minted',
        message: '500 carbon credit NFTs minted',
        time: '6 hours ago',
        icon: Award,
        color: 'text-purple-500'
      },
      {
        type: 'partnership',
        message: 'New enterprise partnership established',
        time: '1 day ago',
        icon: Building2,
        color: 'text-orange-500'
      },
      {
        type: 'compliance',
        message: 'VCS certification renewed for 3 projects',
        time: '2 days ago',
        icon: Shield,
        color: 'text-blue-600'
      }
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform updates and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <activity.icon className={`h-4 w-4 mt-1 ${activity.color}`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Enterprise Dashboard</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <Button
              key={period}
              variant={selectedTimePeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimePeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Projects"
          value={metrics.totalProjects}
          change={12.5}
          icon={Target}
          trend="up"
        />
        <MetricCard
          title="Carbon Sequestered"
          value={metrics.totalCarbonSequestered}
          unit="tCO2e"
          change={8.3}
          icon={Leaf}
          trend="up"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change={15.7}
          icon={DollarSign}
          trend="up"
        />
        <MetricCard
          title="Market Cap"
          value={`$${metrics.marketCapitalization.toLocaleString()}`}
          change={metrics.portfolioGrowth}
          icon={TrendingUp}
          trend="up"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Projects"
          value={metrics.activeProjects}
          change={5.2}
          icon={Activity}
          trend="up"
        />
        <MetricCard
          title="Total Investors"
          value={metrics.totalInvestors}
          change={18.9}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Beneficiaries"
          value={metrics.totalBeneficiaries}
          change={22.1}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Compliance Score"
          value={`${metrics.complianceScore.toFixed(1)}/100`}
          change={2.3}
          icon={Shield}
          trend="up"
        />
      </div>

      {/* Platform Health Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          All systems operational. Platform running at 99.8% uptime with optimal performance across all regions.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Portfolio</TabsTrigger>
          <TabsTrigger value="expansion" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Global Expansion</TabsTrigger>
          <TabsTrigger value="scalability" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Scalability</TabsTrigger>
          <TabsTrigger value="blockchain" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Blockchain</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectTypeBreakdown />
            <RecentActivity />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">
                    {metrics.sustainabilityRating}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ESG Score out of 100
                  </div>
                  <Progress value={metrics.sustainabilityRating} className="w-full" />
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Excellent Rating
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {metrics.totalCarbonSequestered.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      tonnes CO2 equivalent
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Equivalent to taking {Math.floor(metrics.totalCarbonSequestered / 4.6).toLocaleString()} cars off the road for a year
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {metrics.totalBeneficiaries.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      people benefited
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Jobs Created</span>
                      <span className="font-medium">
                        {projects.reduce((acc, p) => acc + p.metrics.jobsCreated, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Communities</span>
                      <span className="font-medium">
                        {projects.reduce((acc, p) => acc + p.stakeholders.localCommunities.length, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6 min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectTypeBreakdown />
            
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['planning', 'development', 'implementation', 'operational', 'completed'].map((status) => {
                    const count = projects.filter(p => p.status === status).length;
                    const percentage = (count / projects.length) * 100;
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{status}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-20" />
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Projects</CardTitle>
              <CardDescription>Projects ranked by sustainability score and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects
                  .sort((a, b) => b.metrics.sustainabilityScore - a.metrics.sustainabilityScore)
                  .slice(0, 5)
                  .map((project, idx) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-sm font-medium">{idx + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.location.country} • {project.projectType.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Progress value={project.metrics.sustainabilityScore} className="w-16" />
                          <span className="text-sm font-medium">
                            {project.metrics.sustainabilityScore}/100
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ${project.metrics.revenueGenerated.toLocaleString()} revenue
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expansion" className="space-y-6 min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlobalExpansionStatus />
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <p>Interactive world map would be displayed here</p>
                    <p className="text-xs">Showing project distribution and performance by region</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scalability" className="space-y-6 min-h-[500px]">
          <div className="space-y-6">
            <ScalabilityMetrics />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">120ms avg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="text-sm font-medium">99.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm font-medium">0.02%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="text-sm font-medium">2,847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Infrastructure Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'API Gateway', status: 'healthy', load: 45 },
                      { name: 'Database Cluster', status: 'healthy', load: 62 },
                      { name: 'Blockchain Network', status: 'healthy', load: 28 },
                      { name: 'AI Data Pipeline', status: 'healthy', load: 71 },
                      { name: 'AI Processing', status: 'healthy', load: 38 }
                    ].map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={service.load} className="w-16" />
                          <span className="text-xs text-muted-foreground w-8">{service.load}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6 min-h-[500px]">
          <BlockchainDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="h-8 w-8 mx-auto mb-2" />
                    <p>Revenue trend chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Impact Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p>Carbon sequestration chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="h-8 w-8 mx-auto mb-2" />
                    <p>Investment pie chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <p>User growth chart would be displayed here</p>
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
