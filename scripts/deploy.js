const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CLORIT Carbon Credits Contract...");

  // Get the contract factory
  const CloritCarbonCredits = await ethers.getContractFactory("CloritCarbonCredits");

  // Deploy the contract
  const cloritCarbonCredits = await CloritCarbonCredits.deploy();

  // Wait for deployment to finish
  await cloritCarbonCredits.waitForDeployment();

  const contractAddress = await cloritCarbonCredits.getAddress();
  console.log("CloritCarbonCredits deployed to:", contractAddress);

  // Add initial verifiers (replace with actual verifier addresses)
  const [deployer] = await ethers.getSigners();
  console.log("Adding deployer as initial verifier:", deployer.address);
  
  await cloritCarbonCredits.addVerifier(deployer.address);
  console.log("Initial verifier added successfully");

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployedAt: new Date().toISOString(),
    network: network.name,
    deployer: deployer.address
  };

  fs.writeFileSync(
    './deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
