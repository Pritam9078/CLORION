/**
 * Centralized mock user data to ensure consistency across all pages
 * This prevents navigation items from disappearing when switching between pages
 */

export const mockUser = {
  name: "Project Owner",
  email: "owner@example.com", 
  role: "PROJECT_OWNER" as "PROJECT_OWNER" | "TRADER" | "VERIFIER",
  walletAddress: "0x742d35Cc6634C0532925a3b8D1B1C93C7aAf3b",
  // Additional properties for project owner functionality
  certifications: ["Project Management", "Carbon Finance"],
  experience: "5 years"
};

// Alternative users for testing different roles
export const mockUsers = {
  projectOwner: {
    name: "Project Owner",
    email: "owner@example.com", 
    role: "PROJECT_OWNER" as "PROJECT_OWNER" | "TRADER" | "VERIFIER",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    certifications: ["Project Management", "Carbon Finance"],
    experience: "5 years"
  },
  
  trader: {
    name: "Jane Smith",
    email: "jane.smith@trader.com", 
    role: "TRADER" as "PROJECT_OWNER" | "TRADER" | "VERIFIER",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    certifications: ["Carbon Trading", "Market Analysis"],
    experience: "5 years"
  },

  verifier: {
    name: "Verifier Admin",
    email: "verifier@clorit.com", 
    role: "VERIFIER" as "PROJECT_OWNER" | "TRADER" | "VERIFIER",
    walletAddress: "0x742d35Cc6634C0532925a3b8D1B1C93C7aAf3b",
    certifications: ["Verra VCS", "Gold Standard", "Climate Action Reserve", "CLORIT Verified"],
    experience: "10 years"
  }
};

// Export default admin user for consistency
export default mockUser;
