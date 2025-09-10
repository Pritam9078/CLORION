"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Waves,
  Users,
  TrendingUp,
  Building2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { FloatingShapes } from "@/components/FloatingShapes";

// Role selection data
const roleOptions = [
  {
    id: "PROJECT_OWNER",
    title: "Project Owner",
    description: "Manage blue carbon projects and earn credits",
    icon: Building2,
    color: "from-green-500 to-emerald-600",
    features: ["Register projects", "Buy credits", "Track progress"]
  },
  {
    id: "TRADER", 
    title: "Trader",
    description: "Trade carbon credits in the marketplace",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-600",
    features: ["Trade credits", "Portfolio analytics", "Market insights"]
  },
  {
    id: "VERIFIER",
    title: "Admin/Verifier",
    description: "Verify projects and manage the platform",
    icon: Shield,
    color: "from-purple-500 to-violet-600", 
    features: ["Verify projects", "Manage users", "Platform oversight"]
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "wallet">("email");
  const [selectedRole, setSelectedRole] = useState<string>("PROJECT_OWNER");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login, user } = useAuth();
  
  // Web3 wallet connection
  const {
    address,
    isConnected,
    isLoading: walletLoading,
    error: walletError,
    connectWallet,
    authenticateWithSignature,
    clearError
  } = useWalletConnection();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user, router]);

  // Clear errors when login method changes
  useEffect(() => {
    setError("");
    if (clearError) clearError();
  }, [loginMethod, clearError]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "TRADER":
        router.push("/trader/dashboard");
        break;
      case "VERIFIER":
        router.push("/admin/dashboard");
        break;
      case "PROJECT_OWNER":
      default:
        router.push("/dashboard");
        break;
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, create a user object with the selected role
      const userData = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0], // Use email prefix as name
        email: email,
        role: selectedRole as 'PROJECT_OWNER' | 'TRADER' | 'VERIFIER'
      };
      
      login(userData, `demo_token_${Date.now()}`);
      
      // Redirect based on selected role
      redirectBasedOnRole(selectedRole);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await connectWallet();
      if (address) {
        // Create user object for wallet authentication
        const userData = {
          id: `wallet_${Date.now()}`,
          name: `User ${address.slice(0, 6)}`,
          email: `${address.slice(0, 8)}@wallet.local`,
          role: selectedRole as 'PROJECT_OWNER' | 'TRADER' | 'VERIFIER',
          walletAddress: address
        };

        if (authenticateWithSignature) {
          const signature = await authenticateWithSignature();
          if (signature) {
            login(userData, `wallet_token_${Date.now()}`);
            redirectBasedOnRole(selectedRole);
          }
        } else {
          // Fallback: just login after wallet connection
          login(userData, `wallet_token_${Date.now()}`);
          redirectBasedOnRole(selectedRole);
        }
      }
    } catch (err) {
      setError("Wallet connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingShapes />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/clorion-logo.png" 
                alt="CLORION Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-gray-900">CLORION</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Don't have an account?</span>
              <Link href="/auth/register">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              className="mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Waves className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-h2 mb-2"
            >
              Welcome back
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-body text-gray-600"
            >
              Sign in to your CLORION account to continue
            </motion.p>
          </div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mb-6"
          >
            <label className="block text-body-small font-medium text-gray-700 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map((role) => (
                <motion.button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all duration-300 text-center",
                    selectedRole === role.id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2",
                    selectedRole === role.id 
                      ? `bg-gradient-to-br ${role.color}` 
                      : "bg-gray-100"
                  )}>
                    <role.icon className={cn(
                      "w-4 h-4",
                      selectedRole === role.id ? "text-white" : "text-gray-600"
                    )} />
                  </div>
                  <div className={cn(
                    "text-xs font-medium",
                    selectedRole === role.id ? "text-blue-700" : "text-gray-700"
                  )}>
                    {role.title.split(' ')[0]}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Login Methods Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-6"
          >
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-body-small font-medium transition-all duration-300",
                  loginMethod === "email"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("wallet")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-body-small font-medium transition-all duration-300",
                  loginMethod === "wallet"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Wallet className="w-4 h-4 inline mr-2" />
                Wallet
              </button>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {loginMethod === "email" ? (
                    <motion.form
                      key="email-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleEmailLogin}
                      className="space-y-6"
                    >
                      {/* Email Input */}
                      <div className="space-y-2">
                        <label className="text-body-small font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div className="space-y-2">
                        <label className="text-body-small font-medium text-gray-700">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-body-small text-gray-600">Remember me</span>
                        </label>
                        <Link href="/auth/forgot-password" className="text-body-small text-blue-600 hover:text-blue-800 transition-colors">
                          Forgot password?
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Signing in...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              Sign in
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="wallet-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-h4 mb-2">Connect Your Wallet</h3>
                        <p className="text-body-small text-gray-600 mb-6">
                          Connect your crypto wallet to sign in securely
                        </p>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleWalletLogin}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Connecting...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Wallet className="w-4 h-4 mr-2" />
                              Connect Wallet
                            </div>
                          )}
                        </Button>
                      </motion.div>

                      {isConnected && address && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-green-50 border border-green-200 rounded-xl"
                        >
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <div>
                              <p className="text-body-small font-medium text-green-800">Wallet Connected</p>
                              <p className="text-xs text-green-600 font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-body-small text-red-800">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="text-center mt-8"
          >
            <p className="text-body-small text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Create one here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
