"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  FileText,
  User,
  Calendar,
  MapPin,
  Building2,
  MessageSquare,
  Flag,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Download,
  ArrowUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for verification requests
const mockVerificationRequests = [
  {
    id: 1,
    projectName: "Mangrove Restoration Project",
    owner: "EcoTech Solutions",
    submissionDate: "2024-01-15",
    category: "Mangrove",
    urgency: "high",
    expectedCredits: 25000,
    location: "Gulf Coast, Florida",
    area: "1,250 hectares",
    documents: [
      { name: "Project Proposal.pdf", size: "2.3 MB", verified: true },
      { name: "Environmental Assessment.pdf", size: "4.1 MB", verified: true },
      { name: "Site Survey.pdf", size: "1.8 MB", verified: false }
    ],
    checklistItems: {
      safetyCompliance: false,
      technicalReview: false,
      kycVerification: true,
      environmentalImpact: false,
      fraudScreening: true
    },
    riskScore: "Medium",
    description: "Large-scale mangrove restoration project aimed at protecting coastal areas and enhancing carbon sequestration in the Gulf Coast region."
  },
  {
    id: 2,
    projectName: "Seagrass Conservation Initiative",
    owner: "Marine Life Foundation",
    submissionDate: "2024-01-12",
    category: "Seagrass",
    urgency: "medium",
    expectedCredits: 18500,
    location: "Chesapeake Bay, Maryland",
    area: "850 hectares",
    documents: [
      { name: "Conservation Plan.pdf", size: "3.2 MB", verified: true },
      { name: "Monitoring Protocol.pdf", size: "1.9 MB", verified: true },
      { name: "Baseline Study.pdf", size: "5.4 MB", verified: true }
    ],
    checklistItems: {
      safetyCompliance: true,
      technicalReview: true,
      kycVerification: true,
      environmentalImpact: true,
      fraudScreening: true
    },
    riskScore: "Low",
    description: "Protection and restoration of critical seagrass habitats to support marine biodiversity and carbon storage."
  },
  {
    id: 3,
    projectName: "Salt Marsh Recovery",
    owner: "Coastal Restoration Inc",
    submissionDate: "2024-01-10",
    category: "Salt Marsh",
    urgency: "low",
    expectedCredits: 12000,
    location: "San Francisco Bay, California",
    area: "450 hectares",
    documents: [
      { name: "Restoration Plan.pdf", size: "2.8 MB", verified: false },
      { name: "Permit Applications.pdf", size: "1.5 MB", verified: false }
    ],
    checklistItems: {
      safetyCompliance: false,
      technicalReview: false,
      kycVerification: true,
      environmentalImpact: false,
      fraudScreening: true
    },
    riskScore: "High",
    description: "Comprehensive salt marsh restoration to improve water quality and coastal resilience."
  }
];

type ChecklistModal = {
  isOpen: boolean;
  projectId: number | null;
  action: "approve" | "reject" | null;
};

export default function AdminVerification() {
  const [requests, setRequests] = useState(mockVerificationRequests);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [checklistModal, setChecklistModal] = useState<ChecklistModal>({
    isOpen: false,
    projectId: null,
    action: null
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminComments, setAdminComments] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const openChecklistModal = (projectId: number, action: "approve" | "reject") => {
    setChecklistModal({
      isOpen: true,
      projectId,
      action
    });
  };

  const closeChecklistModal = () => {
    setChecklistModal({
      isOpen: false,
      projectId: null,
      action: null
    });
    setRejectionReason("");
    setAdminComments("");
  };

  const handleVerificationAction = (projectId: number, action: "approve" | "reject") => {
    const request = requests.find(r => r.id === projectId);
    if (!request) return;

    if (action === "approve") {
      // Check if all checklist items are completed
      const allCompleted = Object.values(request.checklistItems).every(item => item);
      if (!allCompleted) {
        openChecklistModal(projectId, action);
        return;
      }
    }

    if (action === "reject") {
      openChecklistModal(projectId, action);
      return;
    }

    // Process the action
    console.log(`${action === "approve" ? "Approved" : "Rejected"} project ${projectId}`);
    
    // Remove from verification queue
    setRequests(prev => prev.filter(r => r.id !== projectId));
    closeChecklistModal();
  };

  const confirmAction = () => {
    if (!checklistModal.projectId || !checklistModal.action) return;

    const request = requests.find(r => r.id === checklistModal.projectId);
    if (!request) return;

    if (checklistModal.action === "approve") {
      // Check if all checklist items are now completed
      const allCompleted = Object.values(request.checklistItems).every(item => item);
      if (!allCompleted) {
        alert("Please complete all checklist items before approving.");
        return;
      }
    }

    if (checklistModal.action === "reject" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    // Process the action
    console.log(`${checklistModal.action === "approve" ? "Approved" : "Rejected"} project ${checklistModal.projectId}`);
    
    // Remove from verification queue
    setRequests(prev => prev.filter(r => r.id !== checklistModal.projectId));
    closeChecklistModal();
  };

  const toggleChecklistItem = (projectId: number, item: keyof typeof mockVerificationRequests[0]["checklistItems"]) => {
    setRequests(prev => prev.map(request => 
      request.id === projectId 
        ? {
            ...request,
            checklistItems: {
              ...request.checklistItems,
              [item]: !request.checklistItems[item]
            }
          }
        : request
    ));
  };

  const escalateRequest = (projectId: number) => {
    console.log(`Escalated project ${projectId} to Super Admin`);
    // Implementation for escalation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/clorion-logo.png" 
                alt="CLORIT Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-gray-900">CLORIT Admin</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin/dashboard" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/projects" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link href="/admin/verification" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Verification
              </Link>
              <Link href="/admin/enterprises" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Enterprises
              </Link>
              <Link href="/admin/analytics" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Queue</h1>
              <p className="text-lg text-gray-600">Review and verify carbon credit projects</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
                {requests.length} Pending
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { 
                label: "Pending Requests", 
                value: requests.length, 
                color: "blue",
                icon: Clock
              },
              { 
                label: "High Priority", 
                value: requests.filter(r => r.urgency === "high").length, 
                color: "red",
                icon: AlertTriangle
              },
              { 
                label: "Ready to Approve", 
                value: requests.filter(r => Object.values(r.checklistItems).every(item => item)).length, 
                color: "green",
                icon: CheckCircle
              },
              { 
                label: "Requires Review", 
                value: requests.filter(r => !Object.values(r.checklistItems).every(item => item)).length, 
                color: "yellow",
                icon: XCircle
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className={cn("p-2 rounded-lg mr-4",
                        stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                        stat.color === "red" ? "bg-red-100 text-red-600" :
                        stat.color === "green" ? "bg-green-100 text-green-600" :
                        "bg-yellow-100 text-yellow-600"
                      )}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Verification Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {requests.map((request, index) => {
            const allChecklistCompleted = Object.values(request.checklistItems).every(item => item);
            const completedItems = Object.values(request.checklistItems).filter(item => item).length;
            const totalItems = Object.keys(request.checklistItems).length;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{request.projectName}</h3>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {request.urgency} priority
                          </Badge>
                          {allChecklistCompleted && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready to Approve
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{request.description}</p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Owner</p>
                          <p className="font-medium text-gray-900">{request.owner}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-gray-900">{request.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Submitted</p>
                          <p className="font-medium text-gray-900">{request.submissionDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Risk Score</p>
                          <Badge className={cn("text-xs", getRiskColor(request.riskScore))}>
                            {request.riskScore}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Verification Checklist */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Verification Checklist</h4>
                        <span className="text-sm text-gray-500">
                          {completedItems}/{totalItems} completed
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "safetyCompliance", label: "Safety & Compliance" },
                          { key: "technicalReview", label: "Technical Review" },
                          { key: "kycVerification", label: "KYC/Identity Verification" },
                          { key: "environmentalImpact", label: "Environmental Impact" },
                          { key: "fraudScreening", label: "Fraud/Spam Screening" }
                        ].map((item) => (
                          <motion.div
                            key={item.key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <button
                              onClick={() => toggleChecklistItem(request.id, item.key as keyof typeof request.checklistItems)}
                              className={cn(
                                "w-full p-3 rounded-lg border-2 transition-all duration-200 text-left",
                                request.checklistItems[item.key as keyof typeof request.checklistItems]
                                  ? "border-green-300 bg-green-50 text-green-800"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              )}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={cn(
                                  "w-4 h-4 rounded border-2 flex items-center justify-center",
                                  request.checklistItems[item.key as keyof typeof request.checklistItems]
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                )}>
                                  {request.checklistItems[item.key as keyof typeof request.checklistItems] && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm font-medium">{item.label}</span>
                              </div>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {request.documents.map((doc, docIndex) => (
                          <div
                            key={docIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doc.verified ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500" />
                              )}
                              <Button variant="ghost" size="sm">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Link href={`/admin/projects/${request.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => escalateRequest(request.id)}
                          className="flex items-center space-x-1"
                        >
                          <ArrowUp className="w-4 h-4" />
                          <span>Escalate</span>
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVerificationAction(request.id, "reject")}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleVerificationAction(request.id, "approve")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={!allChecklistCompleted}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending verification requests</h3>
            <p className="text-gray-600">All projects have been reviewed and processed.</p>
          </motion.div>
        )}
      </main>

      {/* Checklist Modal */}
      <AnimatePresence>
        {checklistModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeChecklistModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {checklistModal.action === "approve" ? "Final Approval Checklist" : "Reject Project"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={closeChecklistModal}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {checklistModal.action === "approve" && checklistModal.projectId && (
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-600">
                      Please confirm all verification requirements have been met before final approval:
                    </p>
                    
                    {(() => {
                      const request = requests.find(r => r.id === checklistModal.projectId);
                      if (!request) return null;

                      return (
                        <div className="space-y-3">
                          {[
                            { key: "safetyCompliance", label: "Safety & Compliance ✅" },
                            { key: "technicalReview", label: "Technical Review ✅" },
                            { key: "kycVerification", label: "KYC/Identity Verification ✅" },
                            { key: "environmentalImpact", label: "Environmental Impact ✅" },
                            { key: "fraudScreening", label: "Fraud/Spam Screening ✅" }
                          ].map((item) => (
                            <div
                              key={item.key}
                              className={cn(
                                "flex items-center space-x-3 p-3 rounded-lg",
                                request.checklistItems[item.key as keyof typeof request.checklistItems]
                                  ? "bg-green-50 text-green-800"
                                  : "bg-red-50 text-red-800"
                              )}
                            >
                              {request.checklistItems[item.key as keyof typeof request.checklistItems] ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                              <span className="font-medium">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Comments (Optional)
                      </label>
                      <Textarea
                        placeholder="Add any additional comments or notes..."
                        value={adminComments}
                        onChange={(e) => setAdminComments(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {checklistModal.action === "reject" && (
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-600">
                      Please provide a reason for rejecting this project:
                    </p>
                    <Textarea
                      placeholder="Explain why this project is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="outline" onClick={closeChecklistModal}>
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmAction}
                    className={cn(
                      checklistModal.action === "approve" 
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    )}
                  >
                    {checklistModal.action === "approve" ? "Approve Project" : "Reject Project"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
