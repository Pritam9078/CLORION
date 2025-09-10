"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { EnterpriseDashboard } from "@/components/enterprise/EnterpriseDashboard";
import { EnhancedProject, GlobalConfiguration } from "@/types/enhanced";
import { useAuth } from "@/contexts/AuthContext";

export default function EnterprisePage() {
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [configuration, setConfiguration] = useState<GlobalConfiguration | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Simulate loading enterprise data
    setTimeout(() => {
      setProjects(mockEnterpriseProjects);
      setConfiguration(mockGlobalConfiguration);
      setLoading(false);
    }, 1000);
  }, []);

  // Show loading while auth is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header user={user} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {configuration && (
          <EnterpriseDashboard 
            projects={projects}
            configuration={configuration}
          />
        )}
      </div>
    </div>
  );
}

// Mock enterprise projects data
const mockEnterpriseProjects: EnhancedProject[] = [
  {
    id: "project-001",
    name: "Sundarbans Mangrove Restoration",
    description: "Large-scale mangrove restoration in Bangladesh",
    projectType: "blue_carbon",
    scale: "large",
    location: {
      country: "Bangladesh",
      region: "Khulna",
      coordinates: { latitude: 22.3569, longitude: 89.9506 },
      boundaries: [],
      area: 1250
    },
    aiAnalysis: [],
    automatedVerification: { enabled: true, frequency: "daily", thresholds: {} },
    carbonCredits: [],
    tokenization: {
      enabled: true,
      tokenStandard: "ERC-1155",
      totalTokensMinted: 2500,
      availableForSale: 1800,
      pricePerToken: 25
    },
    funding: {
      totalRequired: 2500000,
      currentFunding: 1875000,
      fundingSources: [],
      milestones: []
    },
    compliance: {
      standards: ["VCS", "CDM"],
      certifications: [],
      audits: []
    },
    stakeholders: {
      projectDeveloper: {
        name: "Dr. Rahman",
        organization: "BMF",
        contact: "contact@bmf.org",
        walletAddress: "0x1234..."
      },
      localCommunities: [
        { name: "Fishing Community", representativeContact: "contact@fish.org", benefitShare: 25 }
      ],
      investors: [
        { name: "Green Capital", investmentAmount: 500000, equityShare: 15, walletAddress: "0x5678..." }
      ]
    },
    enterprise: {
      corporatePartnerships: [],
      supplyChainIntegration: true,
      reportingFrequency: "monthly",
      customDashboard: true
    },
    international: {
      crossBorderCompliance: true,
      internationalStandards: ["ISO 14064"],
      localPartners: [],
      currencySupport: ["USD", "EUR"]
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
  },
  {
    id: "project-002",
    name: "Amazon Rainforest Conservation",
    description: "Forest protection and reforestation in Brazil",
    projectType: "forestry",
    scale: "enterprise",
    location: {
      country: "Brazil",
      region: "Amazonas",
      coordinates: { latitude: -3.4653, longitude: -62.2159 },
      boundaries: [],
      area: 5000
    },
    aiAnalysis: [],
    automatedVerification: { enabled: true, frequency: "weekly", thresholds: {} },
    carbonCredits: [],
    tokenization: {
      enabled: true,
      tokenStandard: "ERC-721",
      totalTokensMinted: 5000,
      availableForSale: 3200,
      pricePerToken: 30
    },
    funding: {
      totalRequired: 10000000,
      currentFunding: 7500000,
      fundingSources: [],
      milestones: []
    },
    compliance: {
      standards: ["VCS", "REDD+"],
      certifications: [],
      audits: []
    },
    stakeholders: {
      projectDeveloper: {
        name: "Dr. Silva",
        organization: "Amazon Conservation Foundation",
        contact: "silva@acf.org",
        walletAddress: "0x9abc..."
      },
      localCommunities: [
        { name: "Indigenous Community", representativeContact: "contact@indigenous.org", benefitShare: 40 }
      ],
      investors: [
        { name: "Nature Capital", investmentAmount: 2000000, equityShare: 20, walletAddress: "0xdef0..." }
      ]
    },
    enterprise: {
      corporatePartnerships: [],
      supplyChainIntegration: true,
      reportingFrequency: "quarterly",
      customDashboard: true
    },
    international: {
      crossBorderCompliance: true,
      internationalStandards: ["REDD+", "FSC"],
      localPartners: [],
      currencySupport: ["USD", "BRL"]
    },
    marketplace: {
      listed: true,
      publiclyTradeable: true,
      minimumPurchase: 1,
      maximumPurchase: 500,
      tradingFees: 3.0,
      liquidityPool: true
    },
    status: "operational",
    metrics: {
      carbonSequestered: 45200,
      biodiversityImpact: 95,
      communityBeneficiaries: 1200,
      jobsCreated: 234,
      revenueGenerated: 2400000,
      sustainabilityScore: 97
    },
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date()
  },
  {
    id: "project-003",
    name: "Solar Farm Development",
    description: "Large-scale solar energy project in India",
    projectType: "renewable_energy",
    scale: "enterprise",
    location: {
      country: "India",
      region: "Rajasthan",
      coordinates: { latitude: 27.0238, longitude: 74.2179 },
      boundaries: [],
      area: 800
    },
    aiAnalysis: [],
    automatedVerification: { enabled: true, frequency: "daily", thresholds: {} },
    carbonCredits: [],
    tokenization: {
      enabled: true,
      tokenStandard: "ERC-20",
      totalTokensMinted: 10000,
      availableForSale: 6500,
      pricePerToken: 20
    },
    funding: {
      totalRequired: 15000000,
      currentFunding: 12000000,
      fundingSources: [],
      milestones: []
    },
    compliance: {
      standards: ["CDM", "Gold Standard"],
      certifications: [],
      audits: []
    },
    stakeholders: {
      projectDeveloper: {
        name: "Mr. Sharma",
        organization: "SolarTech India",
        contact: "sharma@solartech.in",
        walletAddress: "0x1122..."
      },
      localCommunities: [
        { name: "Rural Farmers", representativeContact: "contact@farmers.in", benefitShare: 15 }
      ],
      investors: [
        { name: "Clean Energy Fund", investmentAmount: 8000000, equityShare: 35, walletAddress: "0x3344..." }
      ]
    },
    enterprise: {
      corporatePartnerships: [],
      supplyChainIntegration: false,
      reportingFrequency: "monthly",
      customDashboard: true
    },
    international: {
      crossBorderCompliance: true,
      internationalStandards: ["IEC 61215"],
      localPartners: [],
      currencySupport: ["USD", "INR"]
    },
    marketplace: {
      listed: true,
      publiclyTradeable: true,
      minimumPurchase: 10,
      maximumPurchase: 2000,
      tradingFees: 2.0,
      liquidityPool: true
    },
    status: "development",
    metrics: {
      carbonSequestered: 28900,
      biodiversityImpact: 45,
      communityBeneficiaries: 890,
      jobsCreated: 67,
      revenueGenerated: 1200000,
      sustainabilityScore: 89
    },
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date()
  }
];

// Mock global configuration
const mockGlobalConfiguration: GlobalConfiguration = {
  supportedCountries: [
    "Bangladesh", "Brazil", "India", "Indonesia", "Philippines", "Kenya", "Ghana", 
    "Costa Rica", "Mexico", "Colombia", "Peru", "Madagascar", "Mozambique", 
    "Tanzania", "Vietnam", "Thailand", "Malaysia", "Australia", "New Zealand",
    "United States", "Canada", "United Kingdom", "Germany", "France", "Norway"
  ],
  supportedCurrencies: [
    "USD", "EUR", "GBP", "BTC", "ETH", "USDC", "USDT", "BDT", "BRL", "INR", 
    "IDR", "PHP", "KES", "GHS", "CRC", "MXN", "COP", "PEN", "MZN", "TZS",
    "VND", "THB", "MYR", "AUD", "NZD", "CAD", "NOK"
  ],
  complianceFrameworks: [
    "VCS (Verified Carbon Standard)",
    "CDM (Clean Development Mechanism)", 
    "Gold Standard",
    "Climate Action Reserve (CAR)",
    "American Carbon Registry (ACR)",
    "REDD+ (Reducing Emissions from Deforestation)",
    "ISO 14064 (Greenhouse Gas Accounting)",
    "PAS 2060 (Carbon Neutrality)",
    "GHG Protocol",
    "Science Based Targets (SBTi)",
    "UN Framework Convention on Climate Change",
    "Paris Agreement Article 6",
    "EU Emissions Trading System (EU ETS)",
    "CORSIA (Carbon Offsetting for International Aviation)",
    "Task Force on Climate-related Financial Disclosures (TCFD)"
  ],
  partnerships: [
    {
      name: "United Nations Environment Programme",
      type: "regulatory",
      description: "Global environmental policy guidance and standards development"
    },
    {
      name: "World Bank Group",
      type: "financial",
      description: "Climate finance and development funding partnerships"
    },
    {
      name: "Microsoft",
      type: "technology",
      description: "Cloud infrastructure and AI/ML services integration"
    },
    {
      name: "Chainlink",
      type: "technology", 
      description: "Oracle services for real-world data integration"
    },
    {
      name: "Polygon",
      type: "technology",
      description: "Blockchain scaling solutions and carbon-neutral infrastructure"
    },
    {
      name: "Conservation International",
      type: "operational",
      description: "Field operations and conservation expertise"
    },
    {
      name: "WWF (World Wildlife Fund)",
      type: "operational",
      description: "Global conservation network and environmental standards"
    },
    {
      name: "The Nature Conservancy",
      type: "operational",
      description: "Science-based conservation and restoration projects"
    },
    {
      name: "Green Climate Fund",
      type: "financial",
      description: "Climate finance mechanism for developing countries"
    },
    {
      name: "International Finance Corporation",
      type: "financial",
      description: "Private sector climate investment and advisory services"
    }
  ],
  scalabilityMetrics: {
    maxProjectsSupported: 100000,
    maxTransactionsPerSecond: 10000,
    maxUsersSupported: 1000000,
    dataStorageCapacity: "100 PB"
  }
};
