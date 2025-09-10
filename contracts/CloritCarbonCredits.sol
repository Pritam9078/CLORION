// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/**
 * @title CloritCarbonCredits
 * @dev ERC1155 contract for managing blue carbon credits with verification system
 */
contract CloritCarbonCredits is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
    struct Project {
        uint256 id;
        string name;
        string location;
        uint256 area; // in hectares
        string ecosystemType; // mangrove, seagrass, wetland
        address owner;
        bool verified;
        uint256 registrationTime;
        string gisData; // IPFS hash of GIS boundary data
        uint256 co2Captured; // in tonnes
    }

    struct CreditBatch {
        uint256 projectId;
        uint256 amount; // in tonnes of CO2
        uint256 issuanceDate;
        uint256 vintage; // year of CO2 capture
        bool retired;
        string verificationData; // IPFS hash of verification documents
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => CreditBatch) public creditBatches;
    mapping(address => bool) public verifiers;
    mapping(uint256 => mapping(address => bool)) public projectVerifications;

    uint256 public nextProjectId = 1;
    uint256 public nextCreditId = 1;

    event ProjectRegistered(uint256 indexed projectId, address indexed owner, string name);
    event ProjectVerified(uint256 indexed projectId, address indexed verifier);
    event CreditsIssued(uint256 indexed creditId, uint256 indexed projectId, uint256 amount);
    event CreditsRetired(uint256 indexed creditId, uint256 amount, address indexed retiree);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized verifier");
        _;
    }

    modifier onlyProjectOwner(uint256 projectId) {
        require(projects[projectId].owner == msg.sender, "Not project owner");
        _;
    }

    constructor() ERC1155("https://api.clorit.com/metadata/{id}.json") {}

    /**
     * @dev Register a new blue carbon project
     */
    function registerProject(
        string memory name,
        string memory location,
        uint256 area,
        string memory ecosystemType,
        string memory gisData
    ) external whenNotPaused returns (uint256) {
        uint256 projectId = nextProjectId++;
        
        projects[projectId] = Project({
            id: projectId,
            name: name,
            location: location,
            area: area,
            ecosystemType: ecosystemType,
            owner: msg.sender,
            verified: false,
            registrationTime: block.timestamp,
            gisData: gisData,
            co2Captured: 0
        });

        emit ProjectRegistered(projectId, msg.sender, name);
        return projectId;
    }

    /**
     * @dev Verify a project (only by authorized verifiers)
     */
    function verifyProject(uint256 projectId, uint256 co2Captured) external onlyVerifier whenNotPaused {
        require(projects[projectId].id != 0, "Project does not exist");
        require(!projects[projectId].verified, "Project already verified");

        projects[projectId].verified = true;
        projects[projectId].co2Captured = co2Captured;
        projectVerifications[projectId][msg.sender] = true;

        emit ProjectVerified(projectId, msg.sender);
    }

    /**
     * @dev Issue carbon credits for a verified project
     */
    function issueCredits(
        uint256 projectId,
        uint256 amount,
        uint256 vintage,
        string memory verificationData
    ) external onlyOwner whenNotPaused returns (uint256) {
        require(projects[projectId].verified, "Project not verified");
        require(amount > 0, "Amount must be greater than 0");

        uint256 creditId = nextCreditId++;
        
        creditBatches[creditId] = CreditBatch({
            projectId: projectId,
            amount: amount,
            issuanceDate: block.timestamp,
            vintage: vintage,
            retired: false,
            verificationData: verificationData
        });

        _mint(projects[projectId].owner, creditId, amount, "");
        
        emit CreditsIssued(creditId, projectId, amount);
        return creditId;
    }

    /**
     * @dev Retire carbon credits (burn tokens)
     */
    function retireCredits(uint256 creditId, uint256 amount) external whenNotPaused {
        require(balanceOf(msg.sender, creditId) >= amount, "Insufficient balance");
        require(!creditBatches[creditId].retired, "Credits already retired");

        burn(msg.sender, creditId, amount);
        
        if (balanceOf(msg.sender, creditId) == 0) {
            creditBatches[creditId].retired = true;
        }

        emit CreditsRetired(creditId, amount, msg.sender);
    }

    /**
     * @dev Add a new verifier
     */
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    /**
     * @dev Remove a verifier
     */
    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    /**
     * @dev Update project CO2 captured amount (for ongoing monitoring)
     */
    function updateCO2Captured(uint256 projectId, uint256 newAmount) external onlyVerifier {
        require(projects[projectId].verified, "Project not verified");
        projects[projectId].co2Captured = newAmount;
    }

    /**
     * @dev Get project details
     */
    function getProject(uint256 projectId) external view returns (Project memory) {
        return projects[projectId];
    }

    /**
     * @dev Get credit batch details
     */
    function getCreditBatch(uint256 creditId) external view returns (CreditBatch memory) {
        return creditBatches[creditId];
    }

    /**
     * @dev Pause the contract
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Set new URI for metadata
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal whenNotPaused override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
