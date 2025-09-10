"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { RouteProtection } from "@/components/RouteProtection";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionHistory } from "@/components/credits/TransactionHistory";

// Mock transaction data
const mockTransactions = [
  {
    id: "purchase_001",
    projectName: "Sundarbans Mangrove Conservation",
    provider: "Bangladesh Forest Department",
    credits: 500,
    pricePerCredit: 42.50,
    totalAmount: 21250,
    purchaseDate: "2024-03-15T10:30:00Z",
    status: "COMPLETED" as const,
    paymentMethod: "FIAT" as const,
    transactionId: "TXN_ABC123456",
    vintage: "2024",
    certificationStandard: "VCS + CCB"
  },
  {
    id: "purchase_002",
    projectName: "Seychelles Seagrass Restoration", 
    provider: "Seychelles Conservation Foundation",
    credits: 250,
    pricePerCredit: 38.90,
    totalAmount: 9725,
    purchaseDate: "2024-03-10T14:15:00Z",
    status: "COMPLETED" as const,
    paymentMethod: "CRYPTO" as const,
    transactionId: "TXN_DEF789012",
    vintage: "2023",
    certificationStandard: "Gold Standard"
  },
  {
    id: "purchase_003",
    projectName: "California Salt Marsh Recovery",
    provider: "San Francisco Bay Restoration Authority",
    credits: 100,
    pricePerCredit: 55.75,
    totalAmount: 5575,
    purchaseDate: "2024-03-08T09:45:00Z",
    status: "PENDING" as const,
    paymentMethod: "FIAT" as const,
    transactionId: "TXN_GHI345678",
    vintage: "2024",
    certificationStandard: "VCS + CAR"
  },
  {
    id: "purchase_004",
    projectName: "Great Barrier Reef Blue Carbon",
    provider: "Australian Marine Conservation Society",
    credits: 300,
    pricePerCredit: 47.20,
    totalAmount: 14160,
    purchaseDate: "2024-03-05T16:20:00Z",
    status: "COMPLETED" as const,
    paymentMethod: "CRYPTO" as const,
    transactionId: "TXN_JKL901234",
    vintage: "2024",
    certificationStandard: "ACCUs"
  },
  {
    id: "purchase_005",
    projectName: "Madagascar Mangrove Alliance",
    provider: "WCS Madagascar",
    credits: 400,
    pricePerCredit: 35.60,
    totalAmount: 14240,
    purchaseDate: "2024-03-01T11:10:00Z",
    status: "FAILED" as const,
    paymentMethod: "FIAT" as const,
    transactionId: "TXN_MNO567890",
    vintage: "2023",
    certificationStandard: "VCS + CCBS"
  }
];

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const [transactions] = useState(mockTransactions);

  return (
    <RouteProtection allowedRoles={["PROJECT_OWNER"]} redirectTo="/dashboard">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header user={user} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-h2 mb-2">Purchase History</h1>
            <p className="text-body">
              View all your carbon credit purchases, download receipts, and track transaction status.
            </p>
          </div>

          {/* Transaction History Component */}
          <TransactionHistory transactions={transactions} />
        </main>
      </div>
    </RouteProtection>
  );
}
