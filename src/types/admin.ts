export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'PROJECT_OWNER' | 'TRADER' | 'VERIFIER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: string;
  lastLogin?: string;
  walletAddress?: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  twoFactorEnabled: boolean;
}

export interface ProjectApproval {
  id: string;
  projectId: string;
  projectName: string;
  projectOwner: string;
  ownerEmail: string;
  submittedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  assignedVerifier?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'MANGROVE' | 'SEAGRASS' | 'SALT_MARSH';
  estimatedCredits: number;
  location: string;
  area: number;
  documents: ProjectDocument[];
  comments: ApprovalComment[];
  auditLog: AuditLogEntry[];
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'PROJECT_PROPOSAL' | 'SITE_SURVEY' | 'FINANCIAL_PLAN' | 'ENVIRONMENTAL_IMPACT' | 'KYC_DOCUMENT';
  url: string;
  uploadedAt: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string;
  comments?: string;
}

export interface ApprovalComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
  type: 'FEEDBACK' | 'INTERNAL_NOTE' | 'ESCALATION';
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export interface AdminReport {
  id: string;
  title: string;
  type: 'PROJECT_SUMMARY' | 'USER_ACTIVITY' | 'FINANCIAL_OVERVIEW' | 'AUDIT_REPORT';
  generatedBy: string;
  generatedAt: string;
  data: any;
  filters: ReportFilters;
}

export interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  status?: string[];
  category?: string[];
  assignedVerifier?: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'PROJECT_APPROVED' | 'PROJECT_REJECTED' | 'DOCUMENT_REQUIRED' | 'KYC_APPROVED' | 'ACCOUNT_SUSPENDED';
  subject: string;
  body: string;
  isActive: boolean;
}

export interface AdminNotification {
  id: string;
  recipientId: string;
  recipientEmail: string;
  type: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
}

export interface EscalationRule {
  id: string;
  condition: string;
  escalateTo: string;
  priority: 'HIGH' | 'URGENT';
  autoAssign: boolean;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface SecurityEvent {
  id: string;
  userId: string;
  eventType: 'LOGIN_ATTEMPT' | 'FAILED_LOGIN' | 'SUSPICIOUS_ACTIVITY' | 'DOCUMENT_ACCESS' | 'DATA_EXPORT';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string;
}

export interface PermissionSet {
  id: string;
  name: string;
  permissions: Permission[];
  assignedUsers: string[];
}

export interface Permission {
  resource: string;
  actions: ('CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'ESCALATE')[];
}
