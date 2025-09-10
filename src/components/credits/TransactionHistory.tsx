"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  CreditCard,
  Wallet,
  Building,
  Calendar,
  DollarSign,
  Hash
} from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface PurchaseTransaction {
  id: string;
  projectName: string;
  provider: string;
  credits: number;
  pricePerCredit: number;
  totalAmount: number;
  purchaseDate: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod: 'CRYPTO' | 'FIAT';
  transactionId: string;
  receiptUrl?: string;
  vintage: string;
  certificationStandard: string;
}

interface TransactionHistoryProps {
  transactions: PurchaseTransaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<PurchaseTransaction | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return "bg-green-100 text-green-800 border-green-200";
      case 'PENDING': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'FAILED': return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle;
      case 'PENDING': return Clock;
      case 'FAILED': return AlertTriangle;
      default: return Clock;
    }
  };

  const downloadReceipt = (transaction: PurchaseTransaction) => {
    // In a real app, this would download the actual receipt
    console.log(`Downloading receipt for transaction: ${transaction.id}`);
    
    // Simulate receipt generation
    const receiptData = {
      transactionId: transaction.transactionId,
      projectName: transaction.projectName,
      provider: transaction.provider,
      credits: transaction.credits,
      pricePerCredit: transaction.pricePerCredit,
      totalAmount: transaction.totalAmount,
      purchaseDate: transaction.purchaseDate,
      paymentMethod: transaction.paymentMethod,
      vintage: transaction.vintage,
      certificationStandard: transaction.certificationStandard
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>
            View all your carbon credit purchases and download receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600">Your purchase history will appear here once you buy credits.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const StatusIcon = getStatusIcon(transaction.status);
                return (
                  <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{transaction.projectName}</h4>
                            <p className="text-sm text-gray-600">{transaction.provider}</p>
                          </div>
                          <Badge className={getStatusColor(transaction.status)} variant="outline">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {transaction.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Credits:</span>
                            <div className="font-semibold">{formatNumber(transaction.credits)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Price per Credit:</span>
                            <div className="font-semibold">{formatCurrency(transaction.pricePerCredit)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Amount:</span>
                            <div className="font-semibold text-blue-600">{formatCurrency(transaction.totalAmount)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <div className="font-semibold">{new Date(transaction.purchaseDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>TXN: {transaction.transactionId}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {transaction.paymentMethod === 'CRYPTO' ? <Wallet className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                            <span>{transaction.paymentMethod}</span>
                          </div>
                          <div>Vintage: {transaction.vintage}</div>
                          <div>{transaction.certificationStandard}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {transaction.status === 'COMPLETED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadReceipt(transaction)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Complete information about your purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Transaction Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{selectedTransaction.projectName}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(selectedTransaction.credits)} Credits
                  </div>
                  <div className="text-xl font-semibold text-gray-900">
                    {formatCurrency(selectedTransaction.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider:</span>
                      <span className="font-medium">{selectedTransaction.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vintage:</span>
                      <span className="font-medium">{selectedTransaction.vintage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard:</span>
                      <span className="font-medium">{selectedTransaction.certificationStandard}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Transaction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-xs">{selectedTransaction.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedTransaction.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedTransaction.status)} variant="outline">
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(selectedTransaction.purchaseDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Breakdown */}
              <div>
                <h4 className="font-semibold mb-3">Purchase Breakdown</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span>Credits Purchased:</span>
                    <span className="font-semibold">{formatNumber(selectedTransaction.credits)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Price per Credit:</span>
                    <span className="font-semibold">{formatCurrency(selectedTransaction.pricePerCredit)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg text-blue-600">
                        {formatCurrency(selectedTransaction.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedTransaction.status === 'COMPLETED' && (
                  <Button 
                    onClick={() => downloadReceipt(selectedTransaction)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
