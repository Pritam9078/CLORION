import { ethers } from 'ethers';

// MRV Registry Contract ABI (simplified for key functions)
export const MRV_REGISTRY_ABI = [
  // Events
  "event MRVRecordCreated(uint256 indexed id, uint256 indexed projectId, address indexed reporter, string reportType, uint256 timestamp)",
  "event AuditRecordCreated(uint256 indexed id, uint256 indexed projectId, address indexed auditor, string auditType, uint256 timestamp)",
  "event VerificationCompleted(uint256 indexed id, uint256 indexed projectId, uint256 indexed mrvRecordId, address verifier, bool approved, uint256 confidenceScore)",
  "event ComplianceUpdated(uint256 indexed projectId, string standard, bool compliant, uint256 timestamp)",
  "event DataIntegrityAlert(uint256 indexed projectId, string alertType, string description, uint256 timestamp)",
  
  // Read functions
  "function mrvRecords(uint256) view returns (uint256 id, uint256 projectId, uint256 timestamp, string reportType, string dataHash, string methodology, address reporter, bool verified, uint256 co2Measured, string satelliteData, string sensorData, uint8 status)",
  "function auditRecords(uint256) view returns (uint256 id, uint256 projectId, uint256 timestamp, address auditor, string auditType, string findings, string evidenceHash, uint8 result, string recommendations, bool remediated, uint256 followUpDate)",
  "function verificationEvents(uint256) view returns (uint256 id, uint256 projectId, uint256 mrvRecordId, address verifier, uint256 timestamp, bool approved, string comments, string criteriaHash, uint256 confidenceScore, string aiAnalysis)",
  "function getProjectAuditTrail(uint256) view returns (uint256[] memory, uint256[] memory, uint256[] memory)",
  "function getProjectCompliance(uint256, string[] memory) view returns (tuple(uint256 projectId, string standard, bool compliant, uint256 lastChecked, string certificationHash, uint256 expiryDate)[] memory)",
  
  // Write functions
  "function createMRVRecord(uint256 projectId, string reportType, string dataHash, string methodology, uint256 co2Measured, string satelliteData, string sensorData) returns (uint256)",
  "function createAuditRecord(uint256 projectId, string auditType, string findings, string evidenceHash, uint8 result, string recommendations) returns (uint256)",
  "function verifyMRVRecord(uint256 mrvRecordId, bool approved, string comments, string criteriaHash, uint256 confidenceScore, string aiAnalysis) returns (uint256)",
  "function updateCompliance(uint256 projectId, string standard, bool compliant, string certificationHash, uint256 expiryDate)",
  "function markAuditRemediated(uint256 auditId)",
  
  // Role management
  "function grantVerifierRole(address account)",
  "function grantAuditorRole(address account)",
  "function grantProjectOwnerRole(address account)",
  "function grantDataProviderRole(address account)"
] as const;

// TypeScript interfaces for MRV data structures
export interface MRVRecord {
  id: number;
  projectId: number;
  timestamp: number;
  reportType: string;
  dataHash: string;
  methodology: string;
  reporter: string;
  verified: boolean;
  co2Measured: string; // BigNumber as string
  satelliteData: string;
  sensorData: string;
  status: MRVStatus;
}

export interface AuditRecord {
  id: number;
  projectId: number;
  timestamp: number;
  auditor: string;
  auditType: string;
  findings: string;
  evidenceHash: string;
  result: AuditResult;
  recommendations: string;
  remediated: boolean;
  followUpDate: number;
}

export interface VerificationEvent {
  id: number;
  projectId: number;
  mrvRecordId: number;
  verifier: string;
  timestamp: number;
  approved: boolean;
  comments: string;
  criteriaHash: string;
  confidenceScore: number;
  aiAnalysis: string;
}

export interface ComplianceRecord {
  projectId: number;
  standard: string;
  compliant: boolean;
  lastChecked: number;
  certificationHash: string;
  expiryDate: number;
}

export interface ProjectAuditTrail {
  mrvRecords: number[];
  auditRecords: number[];
  verificationEvents: number[];
}

// Enums
export enum MRVStatus {
  PENDING = 0,
  VERIFIED = 1,
  REJECTED = 2,
  EXPIRED = 3
}

export enum AuditResult {
  SATISFACTORY = 0,
  MINOR_ISSUES = 1,
  MAJOR_ISSUES = 2,
  CRITICAL_ISSUES = 3
}

// Parameters for creating records
export interface CreateMRVRecordParams {
  projectId: number;
  reportType: 'monitoring' | 'reporting' | 'verification';
  dataHash: string; // IPFS hash
  methodology: string;
  co2Measured: string; // Amount in tonnes (as string to handle BigNumber)
  satelliteData: string; // IPFS hash
  sensorData: string; // IPFS hash
}

export interface CreateAuditRecordParams {
  projectId: number;
  auditType: 'internal' | 'external' | 'regulatory' | 'compliance';
  findings: string; // IPFS hash
  evidenceHash: string; // IPFS hash
  result: AuditResult;
  recommendations: string; // IPFS hash
}

export interface VerifyMRVRecordParams {
  mrvRecordId: number;
  approved: boolean;
  comments: string; // IPFS hash
  criteriaHash: string; // IPFS hash
  confidenceScore: number; // 0-100
  aiAnalysis: string; // IPFS hash
}

export interface UpdateComplianceParams {
  projectId: number;
  standard: string;
  compliant: boolean;
  certificationHash: string; // IPFS hash
  expiryDate: number; // Unix timestamp
}

/**
 * MRV Registry Contract Service
 * Handles all interactions with the MRV Registry smart contract
 */
class MRVRegistryService {
  private contractAddress: string;
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    // Use environment variable or fallback
    this.contractAddress = process.env.NEXT_PUBLIC_MRV_REGISTRY_ADDRESS || '';
  }

  /**
   * Initialize the service with a provider
   */
  async initialize(provider: ethers.JsonRpcProvider) {
    this.provider = provider;
    if (this.contractAddress) {
      this.contract = new ethers.Contract(this.contractAddress, MRV_REGISTRY_ABI, provider);
    }
  }

  /**
   * Create a new MRV record on the blockchain
   */
  async createMRVRecord(params: CreateMRVRecordParams, signer: ethers.Signer): Promise<string> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const contractWithSigner = this.contract.connect(signer);
      const co2MeasuredWei = ethers.parseEther(params.co2Measured); // Convert to wei for precision
      
      const tx = await contractWithSigner.createMRVRecord(
        params.projectId,
        params.reportType,
        params.dataHash,
        params.methodology,
        co2MeasuredWei,
        params.satelliteData,
        params.sensorData
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error creating MRV record:', error);
      throw new Error(`Failed to create MRV record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new audit record on the blockchain
   */
  async createAuditRecord(params: CreateAuditRecordParams, signer: ethers.Signer): Promise<string> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.createAuditRecord(
        params.projectId,
        params.auditType,
        params.findings,
        params.evidenceHash,
        params.result,
        params.recommendations
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error creating audit record:', error);
      throw new Error(`Failed to create audit record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify an MRV record
   */
  async verifyMRVRecord(params: VerifyMRVRecordParams, signer: ethers.Signer): Promise<string> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.verifyMRVRecord(
        params.mrvRecordId,
        params.approved,
        params.comments,
        params.criteriaHash,
        params.confidenceScore,
        params.aiAnalysis
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error verifying MRV record:', error);
      throw new Error(`Failed to verify MRV record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update compliance status
   */
  async updateCompliance(params: UpdateComplianceParams, signer: ethers.Signer): Promise<string> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.updateCompliance(
        params.projectId,
        params.standard,
        params.compliant,
        params.certificationHash,
        params.expiryDate
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error updating compliance:', error);
      throw new Error(`Failed to update compliance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get MRV record by ID
   */
  async getMRVRecord(recordId: number): Promise<MRVRecord | null> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const record = await this.contract.mrvRecords(recordId);
      
      if (record.id.toString() === '0') return null;
      
      return {
        id: Number(record.id),
        projectId: Number(record.projectId),
        timestamp: Number(record.timestamp),
        reportType: record.reportType,
        dataHash: record.dataHash,
        methodology: record.methodology,
        reporter: record.reporter,
        verified: record.verified,
        co2Measured: ethers.formatEther(record.co2Measured),
        satelliteData: record.satelliteData,
        sensorData: record.sensorData,
        status: record.status
      };
    } catch (error) {
      console.error('Error getting MRV record:', error);
      return null;
    }
  }

  /**
   * Get audit record by ID
   */
  async getAuditRecord(auditId: number): Promise<AuditRecord | null> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const record = await this.contract.auditRecords(auditId);
      
      if (record.id.toString() === '0') return null;
      
      return {
        id: Number(record.id),
        projectId: Number(record.projectId),
        timestamp: Number(record.timestamp),
        auditor: record.auditor,
        auditType: record.auditType,
        findings: record.findings,
        evidenceHash: record.evidenceHash,
        result: record.result,
        recommendations: record.recommendations,
        remediated: record.remediated,
        followUpDate: Number(record.followUpDate)
      };
    } catch (error) {
      console.error('Error getting audit record:', error);
      return null;
    }
  }

  /**
   * Get complete audit trail for a project
   */
  async getProjectAuditTrail(projectId: number): Promise<ProjectAuditTrail | null> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const [mrvIds, auditIds, verificationIds] = await this.contract.getProjectAuditTrail(projectId);
      
      return {
        mrvRecords: mrvIds.map((id: ethers.BigNumberish) => Number(id)),
        auditRecords: auditIds.map((id: ethers.BigNumberish) => Number(id)),
        verificationEvents: verificationIds.map((id: ethers.BigNumberish) => Number(id))
      };
    } catch (error) {
      console.error('Error getting project audit trail:', error);
      return null;
    }
  }

  /**
   * Get project compliance status
   */
  async getProjectCompliance(projectId: number, standards: string[]): Promise<ComplianceRecord[]> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const complianceData = await this.contract.getProjectCompliance(projectId, standards);
      
      return complianceData.map((record: any) => ({
        projectId: Number(record.projectId),
        standard: record.standard,
        compliant: record.compliant,
        lastChecked: Number(record.lastChecked),
        certificationHash: record.certificationHash,
        expiryDate: Number(record.expiryDate)
      }));
    } catch (error) {
      console.error('Error getting project compliance:', error);
      return [];
    }
  }

  /**
   * Listen to MRV events for real-time updates
   */
  setupEventListeners(callbacks: {
    onMRVRecordCreated?: (event: any) => void;
    onAuditRecordCreated?: (event: any) => void;
    onVerificationCompleted?: (event: any) => void;
    onComplianceUpdated?: (event: any) => void;
    onDataIntegrityAlert?: (event: any) => void;
  }) {
    if (!this.contract) throw new Error('Contract not initialized');

    if (callbacks.onMRVRecordCreated) {
      this.contract.on('MRVRecordCreated', callbacks.onMRVRecordCreated);
    }
    
    if (callbacks.onAuditRecordCreated) {
      this.contract.on('AuditRecordCreated', callbacks.onAuditRecordCreated);
    }
    
    if (callbacks.onVerificationCompleted) {
      this.contract.on('VerificationCompleted', callbacks.onVerificationCompleted);
    }
    
    if (callbacks.onComplianceUpdated) {
      this.contract.on('ComplianceUpdated', callbacks.onComplianceUpdated);
    }
    
    if (callbacks.onDataIntegrityAlert) {
      this.contract.on('DataIntegrityAlert', callbacks.onDataIntegrityAlert);
    }
  }

  /**
   * Grant roles to addresses (admin only)
   */
  async grantRole(roleType: 'verifier' | 'auditor' | 'projectOwner' | 'dataProvider', address: string, signer: ethers.Signer): Promise<string> {
    try {
      if (!this.contract) throw new Error('Contract not initialized');
      
      const contractWithSigner = this.contract.connect(signer);
      let tx;
      
      switch (roleType) {
        case 'verifier':
          tx = await contractWithSigner.grantVerifierRole(address);
          break;
        case 'auditor':
          tx = await contractWithSigner.grantAuditorRole(address);
          break;
        case 'projectOwner':
          tx = await contractWithSigner.grantProjectOwnerRole(address);
          break;
        case 'dataProvider':
          tx = await contractWithSigner.grantDataProviderRole(address);
          break;
        default:
          throw new Error('Invalid role type');
      }
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error granting role:', error);
      throw new Error(`Failed to grant ${roleType} role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const mrvRegistryService = new MRVRegistryService();

// Utility functions for MRV operations
export const mrvUtils = {
  /**
   * Generate IPFS hash for MRV data
   */
  generateDataHash: (data: any): string => {
    // In a real implementation, this would upload to IPFS and return the hash
    const jsonString = JSON.stringify(data);
    return `Qm${btoa(jsonString).substring(0, 44)}`; // Mock IPFS hash
  },

  /**
   * Validate MRV record data
   */
  validateMRVData: (data: CreateMRVRecordParams): boolean => {
    return !!(
      data.projectId &&
      data.reportType &&
      data.dataHash &&
      data.methodology &&
      data.co2Measured
    );
  },

  /**
   * Calculate confidence score based on multiple factors
   */
  calculateConfidenceScore: (factors: {
    dataQuality: number; // 0-100
    methodologyStandard: number; // 0-100
    verifierExperience: number; // 0-100
    aiAnalysisScore: number; // 0-100
  }): number => {
    const weights = {
      dataQuality: 0.3,
      methodologyStandard: 0.25,
      verifierExperience: 0.2,
      aiAnalysisScore: 0.25
    };
    
    return Math.round(
      factors.dataQuality * weights.dataQuality +
      factors.methodologyStandard * weights.methodologyStandard +
      factors.verifierExperience * weights.verifierExperience +
      factors.aiAnalysisScore * weights.aiAnalysisScore
    );
  },

  /**
   * Format timestamp for display
   */
  formatTimestamp: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  },

  /**
   * Get audit result description
   */
  getAuditResultDescription: (result: AuditResult): string => {
    switch (result) {
      case AuditResult.SATISFACTORY:
        return 'Satisfactory - No issues found';
      case AuditResult.MINOR_ISSUES:
        return 'Minor Issues - Requires attention';
      case AuditResult.MAJOR_ISSUES:
        return 'Major Issues - Immediate action required';
      case AuditResult.CRITICAL_ISSUES:
        return 'Critical Issues - Urgent intervention needed';
      default:
        return 'Unknown';
    }
  },

  /**
   * Get MRV status description
   */
  getMRVStatusDescription: (status: MRVStatus): string => {
    switch (status) {
      case MRVStatus.PENDING:
        return 'Pending Verification';
      case MRVStatus.VERIFIED:
        return 'Verified';
      case MRVStatus.REJECTED:
        return 'Rejected';
      case MRVStatus.EXPIRED:
        return 'Expired';
      default:
        return 'Unknown';
    }
  }
};
