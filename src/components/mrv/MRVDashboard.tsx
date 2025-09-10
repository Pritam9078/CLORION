"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  TrendingUp,
  Activity,
  Database,
  Satellite,
  Cpu,
  Link,
  Calendar,
  User,
  Hash,
  Award,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  MRVRecord, 
  AuditRecord, 
  VerificationEvent,
  ComplianceRecord,
  MRVStatus,
  AuditResult,
  CreateMRVRecordParams,
  CreateAuditRecordParams,
  VerifyMRVRecordParams,
  mrvRegistryService,
  mrvUtils
} from '@/lib/mrvRegistryService';

interface MRVDashboardProps {
  projectId: number;
  userRole: 'admin' | 'verifier' | 'auditor' | 'projectOwner' | 'viewer';
  className?: string;
}

export function MRVDashboard({ projectId, userRole, className }: MRVDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [mrvRecords, setMrvRecords] = useState<MRVRecord[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [verificationEvents, setVerificationEvents] = useState<VerificationEvent[]>([]);
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [showCreateMRV, setShowCreateMRV] = useState(false);
  const [showCreateAudit, setShowCreateAudit] = useState(false);
  const [showVerifyMRV, setShowVerifyMRV] = useState(false);
  const [selectedMRVRecord, setSelectedMRVRecord] = useState<MRVRecord | null>(null);

  // Form data
  const [mrvFormData, setMrvFormData] = useState<Partial<CreateMRVRecordParams>>({
    projectId,
    reportType: 'monitoring',
    methodology: 'Blue_Carbon_Standard'
  });
  
  const [auditFormData, setAuditFormData] = useState<Partial<CreateAuditRecordParams>>({
    projectId,
    auditType: 'external',
    result: AuditResult.SATISFACTORY
  });

  const [verificationFormData, setVerificationFormData] = useState<Partial<VerifyMRVRecordParams>>({
    approved: true,
    confidenceScore: 85
  });

  // Supported compliance standards
  const complianceStandards = ['VCS', 'CDM', 'Gold_Standard', 'Plan_Vivo', 'REDD+', 'Blue_Carbon_Initiative'];

  // Load data on component mount
  useEffect(() => {
    loadMRVData();
    setupEventListeners();
  }, [projectId]);

  const loadMRVData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get project audit trail
      const auditTrail = await mrvRegistryService.getProjectAuditTrail(projectId);
      
      if (auditTrail) {
        // Load MRV records
        const mrvData = await Promise.all(
          auditTrail.mrvRecords.map(id => mrvRegistryService.getMRVRecord(id))
        );
        setMrvRecords(mrvData.filter(Boolean) as MRVRecord[]);

        // Load audit records
        const auditData = await Promise.all(
          auditTrail.auditRecords.map(id => mrvRegistryService.getAuditRecord(id))
        );
        setAuditRecords(auditData.filter(Boolean) as AuditRecord[]);

        // Load verification events (would need additional service method)
        // For now, mock some verification events
        setVerificationEvents([]);
      }

      // Load compliance records
      const compliance = await mrvRegistryService.getProjectCompliance(projectId, complianceStandards);
      setComplianceRecords(compliance);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load MRV data');
    } finally {
      setLoading(false);
    }
  };

  const setupEventListeners = () => {
    try {
      mrvRegistryService.setupEventListeners({
        onMRVRecordCreated: (event) => {
          if (event.args.projectId.toString() === projectId.toString()) {
            loadMRVData(); // Refresh data
          }
        },
        onAuditRecordCreated: (event) => {
          if (event.args.projectId.toString() === projectId.toString()) {
            loadMRVData(); // Refresh data
          }
        },
        onVerificationCompleted: (event) => {
          if (event.args.projectId.toString() === projectId.toString()) {
            loadMRVData(); // Refresh data
          }
        }
      });
    } catch (err) {
      console.error('Error setting up event listeners:', err);
    }
  };

  const handleCreateMRV = async () => {
    try {
      if (!mrvUtils.validateMRVData(mrvFormData as CreateMRVRecordParams)) {
        setError('Please fill in all required fields');
        return;
      }

      // In a real implementation, you would:
      // 1. Upload detailed data to IPFS
      // 2. Get the wallet signer
      // 3. Call the contract method

      const mockDataHash = mrvUtils.generateDataHash(mrvFormData);
      const mockSatelliteHash = mrvUtils.generateDataHash({ type: 'satellite', data: 'mock' });
      const mockSensorHash = mrvUtils.generateDataHash({ type: 'sensor', data: 'mock' });

      const params: CreateMRVRecordParams = {
        ...mrvFormData as CreateMRVRecordParams,
        dataHash: mockDataHash,
        satelliteData: mockSatelliteHash,
        sensorData: mockSensorHash
      };

      // Mock success for demo
      console.log('Would create MRV record with params:', params);
      
      setShowCreateMRV(false);
      setMrvFormData({ projectId, reportType: 'monitoring', methodology: 'Blue_Carbon_Standard' });
      
      // Refresh data
      await loadMRVData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create MRV record');
    }
  };

  const handleCreateAudit = async () => {
    try {
      // Mock audit creation
      console.log('Would create audit record with params:', auditFormData);
      
      setShowCreateAudit(false);
      setAuditFormData({ projectId, auditType: 'external', result: AuditResult.SATISFACTORY });
      
      // Refresh data
      await loadMRVData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create audit record');
    }
  };

  const handleVerifyMRV = async () => {
    try {
      if (!selectedMRVRecord) return;

      const params: VerifyMRVRecordParams = {
        mrvRecordId: selectedMRVRecord.id,
        ...verificationFormData as Omit<VerifyMRVRecordParams, 'mrvRecordId'>
      };

      // Mock verification
      console.log('Would verify MRV record with params:', params);
      
      setShowVerifyMRV(false);
      setSelectedMRVRecord(null);
      setVerificationFormData({ approved: true, confidenceScore: 85 });
      
      // Refresh data
      await loadMRVData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify MRV record');
    }
  };

  const getStatusBadge = (status: MRVStatus) => {
    const statusConfig = {
      [MRVStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      [MRVStatus.VERIFIED]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [MRVStatus.REJECTED]: { color: 'bg-red-100 text-red-800', icon: XCircle },
      [MRVStatus.EXPIRED]: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={cn('flex items-center gap-1', config.color)}>
        <Icon className="w-3 h-3" />
        {mrvUtils.getMRVStatusDescription(status)}
      </Badge>
    );
  };

  const getAuditResultBadge = (result: AuditResult) => {
    const resultConfig = {
      [AuditResult.SATISFACTORY]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [AuditResult.MINOR_ISSUES]: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      [AuditResult.MAJOR_ISSUES]: { color: 'bg-orange-100 text-orange-800', icon: XCircle },
      [AuditResult.CRITICAL_ISSUES]: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = resultConfig[result];
    const Icon = config.icon;

    return (
      <Badge className={cn('flex items-center gap-1', config.color)}>
        <Icon className="w-3 h-3" />
        {mrvUtils.getAuditResultDescription(result)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            MRV & Audit Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Project ID: {projectId} • Monitoring, Reporting & Verification
          </p>
        </div>
        
        <div className="flex gap-2">
          {(userRole === 'admin' || userRole === 'projectOwner') && (
            <Button onClick={() => setShowCreateMRV(true)} className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Create MRV Record
            </Button>
          )}
          {(userRole === 'admin' || userRole === 'auditor') && (
            <Button onClick={() => setShowCreateAudit(true)} variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Create Audit
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mrv-records">MRV Records</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total MRV Records</p>
                    <p className="text-2xl font-bold">{mrvRecords.length}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verified Records</p>
                    <p className="text-2xl font-bold">{mrvRecords.filter(r => r.verified).length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Audit Records</p>
                    <p className="text-2xl font-bold">{auditRecords.length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Standards</p>
                    <p className="text-2xl font-bold">{complianceRecords.filter(c => c.compliant).length}</p>
                  </div>
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MRV Records Tab */}
        <TabsContent value="mrv-records">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                MRV Records
              </CardTitle>
              <CardDescription>
                Monitoring, Reporting, and Verification records for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mrvRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No MRV records found for this project
                  </div>
                ) : (
                  mrvRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">MRV Record #{record.id}</h4>
                            {getStatusBadge(record.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {record.reportType} • Methodology: {record.methodology}
                          </p>
                          <p className="text-sm text-gray-600">
                            CO2 Measured: {record.co2Measured} tonnes
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {(userRole === 'admin' || userRole === 'verifier') && !record.verified && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedMRVRecord(record);
                                setShowVerifyMRV(true);
                              }}
                            >
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {record.reporter.slice(0, 8)}...
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {mrvUtils.formatTimestamp(record.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Satellite className="w-3 h-3" />
                          Satellite Data
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3" />
                          Sensor Data
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audits Tab */}
        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Audit Records
              </CardTitle>
              <CardDescription>
                Audit trail and compliance verification records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No audit records found for this project
                  </div>
                ) : (
                  auditRecords.map((audit) => (
                    <motion.div
                      key={audit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Audit #{audit.id}</h4>
                            {getAuditResultBadge(audit.result)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {audit.auditType}
                          </p>
                          {audit.remediated && (
                            <Badge className="bg-green-100 text-green-800">Remediated</Badge>
                          )}
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {audit.auditor.slice(0, 8)}...
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {mrvUtils.formatTimestamp(audit.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Evidence Hash
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Compliance Status
              </CardTitle>
              <CardDescription>
                Compliance with international carbon credit standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceStandards.map((standard) => {
                  const compliance = complianceRecords.find(c => c.standard === standard);
                  const isCompliant = compliance?.compliant || false;
                  
                  return (
                    <div key={standard} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{standard}</h4>
                          <p className="text-sm text-gray-600">
                            {compliance ? 
                              `Last checked: ${mrvUtils.formatTimestamp(compliance.lastChecked)}` :
                              'Not assessed'
                            }
                          </p>
                        </div>
                        <Badge className={cn(
                          'flex items-center gap-1',
                          isCompliant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        )}>
                          {isCompliant ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCompliant ? 'Compliant' : 'Not Assessed'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create MRV Record Modal */}
      <AnimatePresence>
        {showCreateMRV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Create MRV Record</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Report Type</label>
                  <select
                    value={mrvFormData.reportType}
                    onChange={(e) => setMrvFormData({...mrvFormData, reportType: e.target.value as any})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="monitoring">Monitoring</option>
                    <option value="reporting">Reporting</option>
                    <option value="verification">Verification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Methodology</label>
                  <Input
                    value={mrvFormData.methodology}
                    onChange={(e) => setMrvFormData({...mrvFormData, methodology: e.target.value})}
                    placeholder="e.g., Blue_Carbon_Standard"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">CO2 Measured (tonnes)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={mrvFormData.co2Measured}
                    onChange={(e) => setMrvFormData({...mrvFormData, co2Measured: e.target.value})}
                    placeholder="2.5"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleCreateMRV} className="flex-1">
                  Create Record
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateMRV(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Audit Record Modal */}
      <AnimatePresence>
        {showCreateAudit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Create Audit Record</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Audit Type</label>
                  <select
                    value={auditFormData.auditType}
                    onChange={(e) => setAuditFormData({...auditFormData, auditType: e.target.value as any})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                    <option value="regulatory">Regulatory</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Audit Result</label>
                  <select
                    value={auditFormData.result}
                    onChange={(e) => setAuditFormData({...auditFormData, result: parseInt(e.target.value) as AuditResult})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={AuditResult.SATISFACTORY}>Satisfactory</option>
                    <option value={AuditResult.MINOR_ISSUES}>Minor Issues</option>
                    <option value={AuditResult.MAJOR_ISSUES}>Major Issues</option>
                    <option value={AuditResult.CRITICAL_ISSUES}>Critical Issues</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleCreateAudit} className="flex-1">
                  Create Audit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateAudit(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify MRV Record Modal */}
      <AnimatePresence>
        {showVerifyMRV && selectedMRVRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">
                Verify MRV Record #{selectedMRVRecord.id}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Verification Decision</label>
                  <select
                    value={verificationFormData.approved ? 'approved' : 'rejected'}
                    onChange={(e) => setVerificationFormData({...verificationFormData, approved: e.target.value === 'approved'})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Confidence Score (0-100)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={verificationFormData.confidenceScore}
                    onChange={(e) => setVerificationFormData({...verificationFormData, confidenceScore: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleVerifyMRV} className="flex-1">
                  Submit Verification
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowVerifyMRV(false);
                    setSelectedMRVRecord(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
