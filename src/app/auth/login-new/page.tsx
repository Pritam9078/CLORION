"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Wallet,
  Shield,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "wallet">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Email login:", { email, password, rememberMe });
      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Mock wallet connection - replace with actual Web3Modal
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Wallet connected");
      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CLORION</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/register"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Create Account
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Card */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">
              Sign in to access your CLORION dashboard
            </p>
          </div>

          {/* Login Methods Toggle */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex rounded-lg border border-gray-200 p-1 mb-6">
                <button
                  onClick={() => setLoginMethod("email")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    loginMethod === "email"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={() => setLoginMethod("wallet")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    loginMethod === "wallet"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Wallet className="w-4 h-4" />
                  Wallet
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Email Login Form */}
              {loginMethod === "email" && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="gradient"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              )}

              {/* Wallet Connect */}
              {loginMethod === "wallet" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Wallet</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Use your crypto wallet to securely access CLORION
                    </p>
                  </div>

                  <Button
                    onClick={handleWalletConnect}
                    className="w-full"
                    variant="gradient"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                    {!isLoading && <Wallet className="w-4 h-4 ml-2" />}
                  </Button>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Secure & Private</h4>
                        <p className="text-xs text-blue-700">
                          Your wallet stays in your control. We never access your private keys.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Demo Accounts</CardTitle>
              <CardDescription className="text-xs">
                Test the platform with these demo credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                <span>Project Owner</span>
                <Badge variant="secondary" className="text-xs">owner@demo.com</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                <span>Trader</span>
                <Badge variant="secondary" className="text-xs">trader@demo.com</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                <span>Verifier</span>
                <Badge variant="secondary" className="text-xs">verifier@demo.com</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">Password: demo123</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
