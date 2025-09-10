// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CloritMRVRegistry
 * @dev Comprehensive MRV (Monitoring, Reporting, Verification) and Audit Data Registry
 * @notice Stores immutable audit trails and verification data for blue carbon projects
 */
contract CloritMRVRegistry is AccessControl, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Role definitions
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant PROJECT_OWNER_ROLE = keccak256("PROJECT_OWNER_ROLE");
    bytes32 public constant DATA_PROVIDER_ROLE = keccak256("DATA_PROVIDER_ROLE");
    
    // Counters for unique IDs
    Counters.Counter private _auditIdCounter;
    Counters.Counter private _mrvRecordCounter;
    Counters.Counter private _verificationCounter;
    
    // Data structures for MRV and Audit records
    struct MRVRecord {
        uint256 id;
        uint256 projectId;
        uint256 timestamp;
        string reportType; // "monitoring", "reporting", "verification"
        string dataHash; // IPFS hash of detailed MRV data
        string methodology; // Verification methodology used
        address reporter;
        bool verified;
        uint256 co2Measured; // CO2 captured in tonnes (scaled by 1e18)
        string satelliteData; // IPFS hash of satellite imagery/analysis
        string sensorData; // Hash of sensor data
        MRVStatus status;
    }
    
    struct AuditRecord {
        uint256 id;
        uint256 projectId;
        uint256 timestamp;
        address auditor;
        string auditType; // "internal", "external", "regulatory", "compliance"
        string findings; // IPFS hash of audit findings
        string evidenceHash; // IPFS hash of supporting evidence
        AuditResult result;
        string recommendations; // IPFS hash of recommendations
        bool remediated;
        uint256 followUpDate;
    }
    
    struct VerificationEvent {
        uint256 id;
        uint256 projectId;
        uint256 mrvRecordId;
        address verifier;
        uint256 timestamp;
        bool approved;
        string comments; // IPFS hash of verification comments
        string criteriaHash; // IPFS hash of verification criteria
        uint256 confidenceScore; // 0-100 percentage
        string aiAnalysis; // IPFS hash of AI analysis results
    }
    
    struct ProjectTimeline {
        uint256 projectId;
        uint256[] mrvRecords;
        uint256[] auditRecords;
        uint256[] verificationEvents;
        uint256 lastUpdated;
    }
    
    struct ComplianceRecord {
        uint256 projectId;
        string standard; // "VCS", "CDM", "Gold Standard", etc.
        bool compliant;
        uint256 lastChecked;
        string certificationHash; // IPFS hash of compliance certificate
        uint256 expiryDate;
    }
    
    // Enums for status tracking
    enum MRVStatus { PENDING, VERIFIED, REJECTED, EXPIRED }
    enum AuditResult { SATISFACTORY, MINOR_ISSUES, MAJOR_ISSUES, CRITICAL_ISSUES }
    
    // Storage mappings
    mapping(uint256 => MRVRecord) public mrvRecords;
    mapping(uint256 => AuditRecord) public auditRecords;
    mapping(uint256 => VerificationEvent) public verificationEvents;
    mapping(uint256 => ProjectTimeline) public projectTimelines;
    mapping(uint256 => mapping(string => ComplianceRecord)) public complianceRecords;
    
    // Additional mappings for queries
    mapping(address => uint256[]) public verifierRecords;
    mapping(address => uint256[]) public auditorRecords;
    mapping(uint256 => uint256[]) public projectMRVRecords;
    mapping(uint256 => uint256[]) public projectAuditRecords;
    
    // Events for transparency and off-chain indexing
    event MRVRecordCreated(
        uint256 indexed id,
        uint256 indexed projectId,
        address indexed reporter,
        string reportType,
        uint256 timestamp
    );
    
    event AuditRecordCreated(
        uint256 indexed id,
        uint256 indexed projectId,
        address indexed auditor,
        string auditType,
        uint256 timestamp
    );
    
    event VerificationCompleted(
        uint256 indexed id,
        uint256 indexed projectId,
        uint256 indexed mrvRecordId,
        address verifier,
        bool approved,
        uint256 confidenceScore
    );
    
    event ComplianceUpdated(
        uint256 indexed projectId,
        string standard,
        bool compliant,
        uint256 timestamp
    );
    
    event DataIntegrityAlert(
        uint256 indexed projectId,
        string alertType,
        string description,
        uint256 timestamp
    );
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new MRV record
     * @param projectId The project ID this MRV record belongs to
     * @param reportType Type of report (monitoring/reporting/verification)
     * @param dataHash IPFS hash of the detailed MRV data
     * @param methodology Verification methodology used
     * @param co2Measured CO2 captured amount (scaled by 1e18)
     * @param satelliteData IPFS hash of satellite data
     * @param sensorData IPFS hash of sensor data
     */
    function createMRVRecord(
        uint256 projectId,
        string memory reportType,
        string memory dataHash,
        string memory methodology,
        uint256 co2Measured,
        string memory satelliteData,
        string memory sensorData
    ) external whenNotPaused returns (uint256) {
        require(hasRole(DATA_PROVIDER_ROLE, msg.sender) || hasRole(PROJECT_OWNER_ROLE, msg.sender), "Unauthorized");
        
        _mrvRecordCounter.increment();
        uint256 recordId = _mrvRecordCounter.current();
        
        mrvRecords[recordId] = MRVRecord({
            id: recordId,
            projectId: projectId,
            timestamp: block.timestamp,
            reportType: reportType,
            dataHash: dataHash,
            methodology: methodology,
            reporter: msg.sender,
            verified: false,
            co2Measured: co2Measured,
            satelliteData: satelliteData,
            sensorData: sensorData,
            status: MRVStatus.PENDING
        });
        
        // Update project timeline
        projectTimelines[projectId].mrvRecords.push(recordId);
        projectTimelines[projectId].lastUpdated = block.timestamp;
        projectMRVRecords[projectId].push(recordId);
        
        emit MRVRecordCreated(recordId, projectId, msg.sender, reportType, block.timestamp);
        
        return recordId;
    }
    
    /**
     * @dev Create a new audit record
     * @param projectId The project ID being audited
     * @param auditType Type of audit (internal/external/regulatory/compliance)
     * @param findings IPFS hash of audit findings
     * @param evidenceHash IPFS hash of supporting evidence
     * @param result Audit result enum
     * @param recommendations IPFS hash of recommendations
     */
    function createAuditRecord(
        uint256 projectId,
        string memory auditType,
        string memory findings,
        string memory evidenceHash,
        AuditResult result,
        string memory recommendations
    ) external whenNotPaused onlyRole(AUDITOR_ROLE) returns (uint256) {
        _auditIdCounter.increment();
        uint256 auditId = _auditIdCounter.current();
        
        auditRecords[auditId] = AuditRecord({
            id: auditId,
            projectId: projectId,
            timestamp: block.timestamp,
            auditor: msg.sender,
            auditType: auditType,
            findings: findings,
            evidenceHash: evidenceHash,
            result: result,
            recommendations: recommendations,
            remediated: false,
            followUpDate: result == AuditResult.SATISFACTORY ? 0 : block.timestamp + 30 days
        });
        
        // Update project timeline and mappings
        projectTimelines[projectId].auditRecords.push(auditId);
        projectTimelines[projectId].lastUpdated = block.timestamp;
        projectAuditRecords[projectId].push(auditId);
        auditorRecords[msg.sender].push(auditId);
        
        emit AuditRecordCreated(auditId, projectId, msg.sender, auditType, block.timestamp);
        
        // Emit alert for critical issues
        if (result == AuditResult.CRITICAL_ISSUES) {
            emit DataIntegrityAlert(projectId, "CRITICAL_AUDIT", "Critical issues found in audit", block.timestamp);
        }
        
        return auditId;
    }
    
    /**
     * @dev Verify an MRV record
     * @param mrvRecordId The MRV record ID to verify
     * @param approved Whether the verification is approved
     * @param comments IPFS hash of verification comments
     * @param criteriaHash IPFS hash of verification criteria
     * @param confidenceScore Confidence score (0-100)
     * @param aiAnalysis IPFS hash of AI analysis results
     */
    function verifyMRVRecord(
        uint256 mrvRecordId,
        bool approved,
        string memory comments,
        string memory criteriaHash,
        uint256 confidenceScore,
        string memory aiAnalysis
    ) external whenNotPaused onlyRole(VERIFIER_ROLE) returns (uint256) {
        require(mrvRecords[mrvRecordId].id != 0, "MRV record does not exist");
        require(confidenceScore <= 100, "Confidence score must be 0-100");
        
        _verificationCounter.increment();
        uint256 verificationId = _verificationCounter.current();
        
        // Update MRV record status
        mrvRecords[mrvRecordId].verified = approved;
        mrvRecords[mrvRecordId].status = approved ? MRVStatus.VERIFIED : MRVStatus.REJECTED;
        
        // Create verification event
        verificationEvents[verificationId] = VerificationEvent({
            id: verificationId,
            projectId: mrvRecords[mrvRecordId].projectId,
            mrvRecordId: mrvRecordId,
            verifier: msg.sender,
            timestamp: block.timestamp,
            approved: approved,
            comments: comments,
            criteriaHash: criteriaHash,
            confidenceScore: confidenceScore,
            aiAnalysis: aiAnalysis
        });
        
        // Update project timeline and mappings
        uint256 projectId = mrvRecords[mrvRecordId].projectId;
        projectTimelines[projectId].verificationEvents.push(verificationId);
        projectTimelines[projectId].lastUpdated = block.timestamp;
        verifierRecords[msg.sender].push(verificationId);
        
        emit VerificationCompleted(verificationId, projectId, mrvRecordId, msg.sender, approved, confidenceScore);
        
        return verificationId;
    }
    
    /**
     * @dev Update compliance status for a project
     * @param projectId The project ID
     * @param standard The compliance standard (VCS, CDM, etc.)
     * @param compliant Whether the project is compliant
     * @param certificationHash IPFS hash of compliance certificate
     * @param expiryDate Expiry date of the compliance certificate
     */
    function updateCompliance(
        uint256 projectId,
        string memory standard,
        bool compliant,
        string memory certificationHash,
        uint256 expiryDate
    ) external whenNotPaused onlyRole(VERIFIER_ROLE) {
        complianceRecords[projectId][standard] = ComplianceRecord({
            projectId: projectId,
            standard: standard,
            compliant: compliant,
            lastChecked: block.timestamp,
            certificationHash: certificationHash,
            expiryDate: expiryDate
        });
        
        emit ComplianceUpdated(projectId, standard, compliant, block.timestamp);
    }
    
    /**
     * @dev Mark audit remediation as complete
     * @param auditId The audit ID that has been remediated
     */
    function markAuditRemediated(uint256 auditId) external whenNotPaused {
        require(auditRecords[auditId].id != 0, "Audit record does not exist");
        require(
            hasRole(AUDITOR_ROLE, msg.sender) || 
            hasRole(PROJECT_OWNER_ROLE, msg.sender), 
            "Unauthorized"
        );
        
        auditRecords[auditId].remediated = true;
    }
    
    /**
     * @dev Get comprehensive project audit trail
     * @param projectId The project ID to get audit trail for
     * @return mrvIds Array of MRV record IDs
     * @return auditIds Array of audit record IDs
     * @return verificationIds Array of verification event IDs
     */
    function getProjectAuditTrail(uint256 projectId) 
        external 
        view 
        returns (
            uint256[] memory mrvIds,
            uint256[] memory auditIds,
            uint256[] memory verificationIds
        ) 
    {
        ProjectTimeline memory timeline = projectTimelines[projectId];
        return (timeline.mrvRecords, timeline.auditRecords, timeline.verificationEvents);
    }
    
    /**
     * @dev Get project compliance status for all standards
     * @param projectId The project ID
     * @param standards Array of standards to check
     * @return compliances Array of compliance records
     */
    function getProjectCompliance(uint256 projectId, string[] memory standards)
        external
        view
        returns (ComplianceRecord[] memory compliances)
    {
        compliances = new ComplianceRecord[](standards.length);
        for (uint256 i = 0; i < standards.length; i++) {
            compliances[i] = complianceRecords[projectId][standards[i]];
        }
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Grant verifier role
     * @param account Address to grant verifier role
     */
    function grantVerifierRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, account);
    }
    
    /**
     * @dev Grant auditor role
     * @param account Address to grant auditor role
     */
    function grantAuditorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(AUDITOR_ROLE, account);
    }
    
    /**
     * @dev Grant project owner role
     * @param account Address to grant project owner role
     */
    function grantProjectOwnerRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PROJECT_OWNER_ROLE, account);
    }
    
    /**
     * @dev Grant data provider role
     * @param account Address to grant data provider role
     */
    function grantDataProviderRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DATA_PROVIDER_ROLE, account);
    }
}
