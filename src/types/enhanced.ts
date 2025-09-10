// Enhanced types for advanced CLORIT features

export interface BlueCarbon {
  ecosystemType: 'mangroves' | 'seagrass' | 'salt_marshes' | 'kelp_forests' | 'coral_reefs';
  marineBiodiversity: {
    speciesCount: number;
    endangeredSpecies: string[];
    biodiversityIndex: number;
  };
  oceanHealth: {
    phLevel: number;
    salinity: number;
    temperature: number;
    oxygenLevel: number;
    pollutionLevel: number;
  };
  coastalProtection: {
    stormProtection: number;
    erosionPrevention: number;
    floodMitigation: number;
  };
}

export interface AIAnalysis {
  id: string;
  projectId: string;
  analysisType: 'carbon_sequestration' | 'ecosystem_health' | 'biodiversity' | 'prediction' | 'verification';
  algorithm: string;
  confidence: number;
  results: {
    carbonSequestration?: {
      dailyRate: number;
      projectedAnnual: number;
      uncertainty: number;
    };
    ecosystemHealth?: {
      score: number;
      trends: string[];
      riskFactors: string[];
    };
    predictions?: {
      timeframe: string;
      scenarios: Array<{
        name: string;
        probability: number;
        impact: number;
      }>;
    };
  };
  createdAt: Date;
  modelVersion: string;
}

export interface CarbonCredit {
  tokenId: string;
  projectId: string;
  creditType: 'VCS' | 'CDM' | 'GS' | 'CAR' | 'BLUE_CARBON';
  vintage: number;
  quantity: number; // in tonnes CO2e
  methodology: string;
  verificationStandard: string;
  tokenStandard: 'ERC-721' | 'ERC-1155' | 'ERC-20';
  metadata: {
    serialNumber: string;
    retirementEligible: boolean;
    additionalityProof: string;
    cobenefits: string[];
    sdgImpacts: number[]; // UN SDG goals
  };
  ownership: {
    currentOwner: string;
    ownershipHistory: Array<{
      owner: string;
      timestamp: Date;
      transactionHash: string;
    }>;
  };
  retirement?: {
    retiredBy: string;
    retiredAt: Date;
    retirementReason: string;
    beneficiary: string;
  };
}

export interface EnhancedProject {
  id: string;
  name: string;
  description: string;
  projectType: 'blue_carbon' | 'forestry' | 'renewable_energy' | 'agriculture' | 'industrial';
  scale: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Location and Geographic Data
  location: {
    country: string;
    region: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    boundaries: Array<{
      latitude: number;
      longitude: number;
    }>;
    area: number; // in hectares
  };

  // Blue Carbon Specific
  blueCarbon?: BlueCarbon;

  // AI/ML Integration
  aiAnalysis: AIAnalysis[];
  automatedVerification: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    thresholds: Record<string, number>;
    lastRun?: Date;
  };

  // Tokenization
  carbonCredits: CarbonCredit[];
  tokenization: {
    enabled: boolean;
    tokenStandard: 'ERC-721' | 'ERC-1155' | 'ERC-20';
    smartContractAddress?: string;
    totalTokensMinted: number;
    availableForSale: number;
    pricePerToken: number; // in USD
  };

  // Financial and Development Support
  funding: {
    totalRequired: number;
    currentFunding: number;
    fundingSources: Array<{
      source: string;
      amount: number;
      type: 'grant' | 'investment' | 'carbon_sales' | 'crowdfunding';
      date: Date;
    }>;
    milestones: Array<{
      description: string;
      targetDate: Date;
      requiredFunding: number;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };

  // Compliance and Standards
  compliance: {
    standards: string[];
    certifications: Array<{
      name: string;
      issuer: string;
      validUntil: Date;
      documentUrl: string;
    }>;
    audits: Array<{
      auditor: string;
      date: Date;
      result: 'passed' | 'conditional' | 'failed';
      reportUrl: string;
    }>;
  };

  // Stakeholders
  stakeholders: {
    projectDeveloper: {
      name: string;
      organization: string;
      contact: string;
      walletAddress: string;
    };
    localCommunities: Array<{
      name: string;
      representativeContact: string;
      benefitShare: number; // percentage
    }>;
    investors: Array<{
      name: string;
      investmentAmount: number;
      equityShare: number;
      walletAddress: string;
    }>;
  };

  // Enterprise Features
  enterprise: {
    corporatePartnerships: Array<{
      companyName: string;
      partnershipType: string;
      commitmentAmount: number;
      contractUrl: string;
    }>;
    supplyChainIntegration: boolean;
    reportingFrequency: 'monthly' | 'quarterly' | 'annually';
    customDashboard: boolean;
  };

  // Global Expansion
  international: {
    crossBorderCompliance: boolean;
    internationalStandards: string[];
    localPartners: Array<{
      country: string;
      partnerName: string;
      role: string;
    }>;
    currencySupport: string[];
  };

  // Marketplace Integration
  marketplace: {
    listed: boolean;
    publiclyTradeable: boolean;
    minimumPurchase: number;
    maximumPurchase: number;
    tradingFees: number; // percentage
    liquidityPool: boolean;
  };

  // Project Status and Metrics
  status: 'planning' | 'development' | 'implementation' | 'operational' | 'completed' | 'paused';
  metrics: {
    carbonSequestered: number; // tonnes CO2e
    biodiversityImpact: number;
    communityBeneficiaries: number;
    jobsCreated: number;
    revenueGenerated: number;
    sustainabilityScore: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceOrder {
  id: string;
  type: 'buy' | 'sell';
  creditTokenId: string;
  quantity: number;
  pricePerCredit: number;
  totalPrice: number;
  seller: string;
  buyer?: string;
  status: 'open' | 'filled' | 'cancelled' | 'expired';
  expiresAt: Date;
  createdAt: Date;
  filledAt?: Date;
  transactionHash?: string;
}

export interface SmartContractInteraction {
  contractAddress: string;
  abi: any[];
  network: 'ethereum' | 'polygon' | 'bsc' | 'arbitrum';
  gasEstimate?: number;
  gasPrice?: number;
}

export interface GlobalConfiguration {
  supportedCountries: string[];
  supportedCurrencies: string[];
  complianceFrameworks: string[];
  partnerships: Array<{
    name: string;
    type: 'technology' | 'financial' | 'regulatory' | 'operational';
    description: string;
  }>;
  scalabilityMetrics: {
    maxProjectsSupported: number;
    maxTransactionsPerSecond: number;
    maxUsersSupported: number;
    dataStorageCapacity: string;
  };
}
