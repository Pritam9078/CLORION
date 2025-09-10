"use client";

import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";

export default function WalletTestPage() {
  const {
    address,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    authenticateWithSignature,
    clearError
  } = useWalletConnection();

  const handleTestSignMessage = async () => {
    try {
      const signature = await signMessage("Hello from CLORIT! This is a test message.");
      console.log("Signature:", signature);
      alert("Message signed successfully! Check console for signature.");
    } catch (err) {
      console.error("Sign message failed:", err);
    }
  };

  const handleTestAuthentication = async () => {
    try {
      const authData = await authenticateWithSignature();
      console.log("Authentication data:", authData);
      alert("Authentication successful! Check console for details.");
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="text-center">
            {isConnected ? (
              <div className="space-y-2">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
                <p className="text-sm font-mono text-gray-600">
                  {address}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto" />
                <Badge variant="secondary">Not Connected</Badge>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
              <Button
                onClick={clearError}
                variant="ghost"
                size="sm"
                className="ml-auto"
              >
                ×
              </Button>
            </div>
          )}

          {/* Connection Actions */}
          <div className="space-y-2">
            {!isConnected ? (
              <Button
                onClick={connectWallet}
                variant="gradient"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  className="w-full"
                >
                  Disconnect Wallet
                </Button>
                <Button
                  onClick={handleTestSignMessage}
                  variant="default"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing..." : "Test Sign Message"}
                </Button>
                <Button
                  onClick={handleTestAuthentication}
                  variant="gradient"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Test Authentication"}
                </Button>
              </div>
            )}
          </div>

          {/* Debug Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <strong>Debug Info:</strong><br />
            Connected: {isConnected ? "Yes" : "No"}<br />
            Loading: {isLoading ? "Yes" : "No"}<br />
            Address: {address || "None"}<br />
            Error: {error || "None"}
          </div>

          {/* Back to Login */}
          <Button
            onClick={() => window.location.href = "/auth/login"}
            variant="ghost"
            className="w-full"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
