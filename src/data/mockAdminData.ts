import { AdminUser, ProjectApproval, AdminReport, AdminNotification, ChatMessage, SecurityEvent, AuditLogEntry } from '@/types/admin';

// Mock data for admin panel features

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'user_1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'PROJECT_OWNER',
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-12-01T14:22:00Z',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    kycStatus: 'VERIFIED',
    twoFactorEnabled: true
  },
  {
    id: 'user_2',
    name: 'Sarah Connor',
    email: 'sarah.connor@trader.com',
    role: 'TRADER',
    status: 'ACTIVE',
    createdAt: '2024-02-10T09:15:00Z',
    lastLogin: '2024-12-01T11:45:00Z',
    walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
    kycStatus: 'VERIFIED',
    twoFactorEnabled: false
  },
  {
    id: 'user_3',
    name: 'Michael Johnson',
    email: 'michael.johnson@ocean.org',
    role: 'PROJECT_OWNER',
    status: 'SUSPENDED',
    createdAt: '2024-03-05T16:20:00Z',
    lastLogin: '2024-11-28T08:30:00Z',
    kycStatus: 'PENDING',
    twoFactorEnabled: false
  },
  {
    id: 'user_4',
    name: 'Emma Wilson',
    email: 'emma.wilson@verifier.com',
    role: 'VERIFIER',
    status: 'ACTIVE',
    createdAt: '2024-01-20T12:00:00Z',
    lastLogin: '2024-12-01T16:10:00Z',
    kycStatus: 'VERIFIED',
    twoFactorEnabled: true
  },
  {
    id: 'user_5',
    name: 'David Brown',
    email: 'david.brown@suspicious.com',
    role: 'TRADER',
    status: 'BANNED',
    createdAt: '2024-11-01T14:30:00Z',
    lastLogin: '2024-11-25T20:15:00Z',
    walletAddress: '0xsuspicious123456789012345678901234567890',
    kycStatus: 'REJECTED',
    twoFactorEnabled: false
  }
];

export const mockProjectApprovals: ProjectApproval[] = [
  {
    id: 'approval_1',
    projectId: 'proj_001',
    projectName: 'Pacific Mangrove Restoration Initiative',
    projectOwner: 'John Smith',
    ownerEmail: 'john.smith@example.com',
    submittedDate: '2024-11-28T10:00:00Z',
    status: 'PENDING',
    assignedVerifier: 'Emma Wilson',
    priority: 'HIGH',
    category: 'MANGROVE',
    estimatedCredits: 25000,
    location: 'Philippines - Palawan',
    area: 500,
    documents: [
      {
        id: 'doc_1',
        name: 'Project Proposal.pdf',
        type: 'PROJECT_PROPOSAL',
        url: '/documents/project_proposal_001.pdf',
        uploadedAt: '2024-11-28T10:00:00Z',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Emma Wilson',
        verifiedAt: '2024-11-29T14:30:00Z'
      },
      {
        id: 'doc_2',
        name: 'Site Survey Report.pdf',
        type: 'SITE_SURVEY',
        url: '/documents/site_survey_001.pdf',
        uploadedAt: '2024-11-28T10:05:00Z',
        verificationStatus: 'PENDING'
      },
      {
        id: 'doc_3',
        name: 'Environmental Impact Assessment.pdf',
        type: 'ENVIRONMENTAL_IMPACT',
        url: '/documents/eia_001.pdf',
        uploadedAt: '2024-11-28T10:10:00Z',
        verificationStatus: 'REJECTED',
        verifiedBy: 'Emma Wilson',
        verifiedAt: '2024-11-29T15:00:00Z',
        comments: 'Missing baseline biodiversity data. Please provide comprehensive species inventory.'
      }
    ],
    comments: [
      {
        id: 'comment_1',
        userId: 'user_4',
        userName: 'Emma Wilson',
        comment: 'Initial review looks promising. Environmental impact assessment needs revision.',
        timestamp: '2024-11-29T15:00:00Z',
        type: 'FEEDBACK'
      }
    ],
    auditLog: [
      {
        id: 'audit_1',
        action: 'PROJECT_SUBMITTED',
        performedBy: 'John Smith',
        timestamp: '2024-11-28T10:00:00Z',
        details: 'Project submitted for verification'
      },
      {
        id: 'audit_2',
        action: 'ASSIGNED_VERIFIER',
        performedBy: 'System',
        timestamp: '2024-11-28T10:30:00Z',
        details: 'Assigned to Emma Wilson for verification'
      }
    ]
  },
  {
    id: 'approval_2',
    projectId: 'proj_002',
    projectName: 'Caribbean Seagrass Conservation',
    projectOwner: 'Michael Johnson',
    ownerEmail: 'michael.johnson@ocean.org',
    submittedDate: '2024-11-25T14:20:00Z',
    status: 'ESCALATED',
    assignedVerifier: 'Emma Wilson',
    priority: 'URGENT',
    category: 'SEAGRASS',
    estimatedCredits: 18000,
    location: 'Bahamas - Andros Island',
    area: 300,
    documents: [
      {
        id: 'doc_4',
        name: 'Project Proposal.pdf',
        type: 'PROJECT_PROPOSAL',
        url: '/documents/project_proposal_002.pdf',
        uploadedAt: '2024-11-25T14:20:00Z',
        verificationStatus: 'VERIFIED'
      }
    ],
    comments: [
      {
        id: 'comment_2',
        userId: 'user_4',
        userName: 'Emma Wilson',
        comment: 'Complex jurisdiction issues. Escalating to senior admin for review.',
        timestamp: '2024-11-26T11:30:00Z',
        type: 'ESCALATION'
      }
    ],
    auditLog: [
      {
        id: 'audit_3',
        action: 'PROJECT_SUBMITTED',
        performedBy: 'Michael Johnson',
        timestamp: '2024-11-25T14:20:00Z',
        details: 'Project submitted for verification'
      },
      {
        id: 'audit_4',
        action: 'ESCALATED',
        performedBy: 'Emma Wilson',
        timestamp: '2024-11-26T11:30:00Z',
        details: 'Escalated due to jurisdiction complexity'
      }
    ]
  }
];

export const mockAdminReports: AdminReport[] = [
  {
    id: 'report_1',
    title: 'Monthly Project Summary - November 2024',
    type: 'PROJECT_SUMMARY',
    generatedBy: 'Emma Wilson',
    generatedAt: '2024-12-01T09:00:00Z',
    data: {
      totalProjects: 45,
      pendingApprovals: 12,
      approvedProjects: 28,
      rejectedProjects: 5,
      totalCredits: 450000,
      averageApprovalTime: '5.2 days'
    },
    filters: {
      dateRange: {
        start: '2024-11-01',
        end: '2024-11-30'
      }
    }
  },
  {
    id: 'report_2',
    title: 'User Activity Report - Q4 2024',
    type: 'USER_ACTIVITY',
    generatedBy: 'Admin System',
    generatedAt: '2024-12-01T10:30:00Z',
    data: {
      newUsers: 127,
      activeUsers: 384,
      suspendedUsers: 8,
      bannedUsers: 3,
      kycVerifications: 95,
      loginSessions: 2456
    },
    filters: {
      dateRange: {
        start: '2024-10-01',
        end: '2024-11-30'
      }
    }
  }
];

export const mockNotifications: AdminNotification[] = [
  {
    id: 'notif_1',
    recipientId: 'user_1',
    recipientEmail: 'john.smith@example.com',
    type: 'PROJECT_APPROVED',
    subject: 'Your Project Has Been Approved!',
    body: 'Congratulations! Your Pacific Mangrove Restoration Initiative has been approved.',
    sentAt: '2024-11-30T16:45:00Z',
    status: 'SENT'
  },
  {
    id: 'notif_2',
    recipientId: 'user_3',
    recipientEmail: 'michael.johnson@ocean.org',
    type: 'DOCUMENT_REQUIRED',
    subject: 'Additional Documents Required',
    body: 'Your project requires additional environmental impact documentation.',
    sentAt: '2024-11-29T14:20:00Z',
    status: 'SENT'
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'chat_1',
    projectId: 'proj_001',
    fromUserId: 'user_4',
    fromUserName: 'Emma Wilson',
    toUserId: 'user_1',
    toUserName: 'John Smith',
    message: 'Hi John, I need clarification on the proposed restoration timeline.',
    timestamp: '2024-11-29T10:30:00Z',
    isRead: true
  },
  {
    id: 'chat_2',
    projectId: 'proj_001',
    fromUserId: 'user_1',
    fromUserName: 'John Smith',
    toUserId: 'user_4',
    toUserName: 'Emma Wilson',
    message: 'Hi Emma, the restoration will be completed in phases over 18 months.',
    timestamp: '2024-11-29T11:15:00Z',
    isRead: false
  }
];

export const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'security_1',
    userId: 'user_5',
    eventType: 'SUSPICIOUS_ACTIVITY',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-11-29T22:30:00Z',
    riskLevel: 'HIGH',
    details: 'Multiple failed login attempts followed by successful login from different IP'
  },
  {
    id: 'security_2',
    userId: 'user_2',
    eventType: 'DATA_EXPORT',
    ipAddress: '10.0.0.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2024-11-29T14:45:00Z',
    riskLevel: 'MEDIUM',
    details: 'Large dataset export performed'
  }
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit_log_1',
    action: 'USER_SUSPENDED',
    performedBy: 'Emma Wilson',
    timestamp: '2024-11-29T16:20:00Z',
    details: 'Suspended user Michael Johnson due to incomplete KYC verification',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'audit_log_2',
    action: 'PROJECT_APPROVED',
    performedBy: 'Emma Wilson',
    timestamp: '2024-11-29T15:30:00Z',
    details: 'Approved project: Pacific Mangrove Restoration Initiative',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'audit_log_3',
    action: 'DOCUMENT_VERIFIED',
    performedBy: 'Emma Wilson',
    timestamp: '2024-11-29T14:30:00Z',
    details: 'Verified project proposal document for proj_001',
    ipAddress: '192.168.1.45'
  }
];
