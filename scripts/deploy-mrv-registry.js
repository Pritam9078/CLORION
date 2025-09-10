const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying CLORIT MRV Registry Contract...");

  // Get the contract factory
  const CloritMRVRegistry = await ethers.getContractFactory("CloritMRVRegistry");

  // Deploy the contract
  console.log("📋 Deploying MRV Registry...");
  const mrvRegistry = await CloritMRVRegistry.deploy();

  // Wait for deployment to finish
  await mrvRegistry.waitForDeployment();

  const contractAddress = await mrvRegistry.getAddress();
  console.log("✅ CloritMRVRegistry deployed to:", contractAddress);

  // Get deployer and other accounts
  const [deployer, verifier1, auditor1, projectOwner1] = await ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);

  // Set up initial roles
  console.log("🔐 Setting up initial roles...");

  // Grant verifier role to account
  if (verifier1) {
    await mrvRegistry.grantVerifierRole(verifier1.address);
    console.log("✅ Granted VERIFIER role to:", verifier1.address);
  }

  // Grant auditor role to account
  if (auditor1) {
    await mrvRegistry.grantAuditorRole(auditor1.address);
    console.log("✅ Granted AUDITOR role to:", auditor1.address);
  }

  // Grant project owner role to account
  if (projectOwner1) {
    await mrvRegistry.grantProjectOwnerRole(projectOwner1.address);
    console.log("✅ Granted PROJECT_OWNER role to:", projectOwner1.address);
  }

  // Grant data provider role to deployer (for testing)
  await mrvRegistry.grantDataProviderRole(deployer.address);
  console.log("✅ Granted DATA_PROVIDER role to deployer");

  // Create deployment info object
  const deploymentInfo = {
    contractName: "CloritMRVRegistry",
    contractAddress: contractAddress,
    deployedAt: new Date().toISOString(),
    network: network.name,
    deployer: deployer.address,
    blockNumber: (await ethers.provider.getBlock('latest')).number,
    gasUsed: "estimated", // Will be filled by actual deployment
    roles: {
      admin: deployer.address,
      verifiers: verifier1 ? [verifier1.address] : [],
      auditors: auditor1 ? [auditor1.address] : [],
      projectOwners: projectOwner1 ? [projectOwner1.address] : [],
      dataProviders: [deployer.address]
    },
    features: [
      "MRV Record Management",
      "Audit Trail Storage",
      "Verification Workflows",
      "Compliance Tracking",
      "Role-based Access Control",
      "Event Emissions",
      "IPFS Integration Ready"
    ]
  };

  // Save deployment info to file
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `mrv-registry-${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Generate environment variable template
  const envTemplate = `
# MRV Registry Contract Configuration
NEXT_PUBLIC_MRV_REGISTRY_ADDRESS="${contractAddress}"
NEXT_PUBLIC_MRV_REGISTRY_NETWORK="${network.name}"

# Role Addresses for Testing
MRV_ADMIN_ADDRESS="${deployer.address}"
MRV_VERIFIER_ADDRESS="${verifier1 ? verifier1.address : ''}"
MRV_AUDITOR_ADDRESS="${auditor1 ? auditor1.address : ''}"
MRV_PROJECT_OWNER_ADDRESS="${projectOwner1 ? projectOwner1.address : ''}"
`;

  const envFile = path.join(__dirname, '..', `.env.mrv.${network.name}`);
  fs.writeFileSync(envFile, envTemplate);
  console.log("🔧 Environment template saved to:", envFile);

  // Test the contract with sample data
  console.log("🧪 Testing contract functionality...");

  try {
    // Create a sample MRV record
    const sampleMRVTx = await mrvRegistry.createMRVRecord(
      1, // projectId
      "monitoring", // reportType
      "QmSampleDataHash123", // dataHash (mock IPFS)
      "Blue_Carbon_Standard", // methodology
      ethers.parseEther("2.5"), // co2Measured (2.5 tonnes)
      "QmSampleSatelliteHash", // satelliteData
      "QmSampleSensorHash" // sensorData
    );
    
    await sampleMRVTx.wait();
    console.log("✅ Sample MRV record created successfully");

    // Create a sample audit record (if auditor is available)
    if (auditor1) {
      const sampleAuditTx = await mrvRegistry.connect(auditor1).createAuditRecord(
        1, // projectId
        "external", // auditType
        "QmSampleAuditFindings", // findings
        "QmSampleAuditEvidence", // evidenceHash
        0, // AuditResult.SATISFACTORY
        "QmSampleRecommendations" // recommendations
      );
      
      await sampleAuditTx.wait();
      console.log("✅ Sample audit record created successfully");
    }

    // Verify the MRV record (if verifier is available)
    if (verifier1) {
      const verificationTx = await mrvRegistry.connect(verifier1).verifyMRVRecord(
        1, // mrvRecordId
        true, // approved
        "QmVerificationComments", // comments
        "QmVerificationCriteria", // criteriaHash
        85, // confidenceScore
        "QmAIAnalysisResults" // aiAnalysis
      );
      
      await verificationTx.wait();
      console.log("✅ Sample MRV record verified successfully");
    }

    // Get audit trail
    const auditTrail = await mrvRegistry.getProjectAuditTrail(1);
    console.log("📊 Project audit trail:", {
      mrvRecords: auditTrail[0].map(id => id.toString()),
      auditRecords: auditTrail[1].map(id => id.toString()),
      verificationEvents: auditTrail[2].map(id => id.toString())
    });

  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
  }

  console.log("\n🎉 MRV Registry deployment completed successfully!");
  console.log("📋 Summary:");
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Network: ${network.name}`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Block Number: ${(await ethers.provider.getBlock('latest')).number}`);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Update your .env file with the contract address");
  console.log("2. Initialize the MRV Registry Service in your application");
  console.log("3. Set up IPFS integration for storing detailed data");
  console.log("4. Configure event listeners for real-time updates");
  console.log("5. Integrate with your existing CLORIT frontend");

  console.log("\n🔗 Integration Code:");
  console.log(`
// Add to your environment variables:
NEXT_PUBLIC_MRV_REGISTRY_ADDRESS="${contractAddress}"

// Initialize in your application:
import { mrvRegistryService } from '@/lib/mrvRegistryService';
await mrvRegistryService.initialize(provider);
  `);

  return {
    contractAddress,
    deploymentInfo,
    network: network.name
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
