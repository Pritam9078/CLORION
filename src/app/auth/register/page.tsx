"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Wallet,
  Shield,
  AlertCircle,
  CheckCircle,
  Waves,
  TrendingUp,
  Building2,
  ArrowRight,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { FloatingShapes } from "@/components/FloatingShapes";

// Role selection data
const roleOptions = [
  {
    id: "PROJECT_OWNER",
    title: "Project Owner",
    description: "Manage blue carbon projects and earn credits",
    icon: Building2,
    color: "from-green-500 to-emerald-600",
    features: ["Register projects", "Buy credits", "Track progress", "Monitor impact"]
  },
  {
    id: "TRADER", 
    title: "Trader",
    description: "Trade carbon credits in the marketplace",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-600",
    features: ["Trade credits", "Portfolio analytics", "Market insights", "Price tracking"]
  },
  {
    id: "VERIFIER",
    title: "Admin/Verifier",
    description: "Verify projects and manage the platform",
    icon: Shield,
    color: "from-purple-500 to-violet-600", 
    features: ["Verify projects", "Manage users", "Platform oversight", "Audit trails"]
  }
];

const registrationSteps = [
  { id: 1, title: "Role Selection", description: "Choose your account type" },
  { id: 2, title: "Account Details", description: "Enter your information" },
  { id: 3, title: "Verification", description: "Verify your account" }
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>("PROJECT_OWNER");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registrationMethod, setRegistrationMethod] = useState<"email" | "wallet">("email");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { login, user } = useAuth();
  
  // Web3 wallet connection
  const {
    address,
    isConnected,
    isLoading: walletLoading,
    error: walletError,
    connectWallet,
    authenticateWithSignature
  } = useWalletConnection();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 2) {
      if (registrationMethod === "email") {
        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) errors.email = "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format";
        if (!password.trim()) errors.password = "Password is required";
        if (password.length < 8) errors.password = "Password must be at least 8 characters";
        if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
        if (!agreeToTerms) errors.terms = "You must agree to the terms and conditions";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleEmailRegistration = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user object
      const userData = {
        id: `user_${Date.now()}`,
        name: name,
        email: email,
        role: selectedRole as 'PROJECT_OWNER' | 'TRADER' | 'VERIFIER' | 'ADMIN'
      };
      
      login(userData, `demo_token_${Date.now()}`);
      
      // Redirect based on role
      redirectBasedOnRole(selectedRole);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletRegistration = async () => {
    setIsLoading(true);
    setError("");

    try {
      await connectWallet();
      if (address) {
        // Create user object for wallet registration
        const userData = {
          id: `wallet_${Date.now()}`,
          name: name || `User ${address.slice(0, 6)}`,
          email: `${address.slice(0, 8)}@wallet.local`,
          role: selectedRole as 'PROJECT_OWNER' | 'TRADER' | 'VERIFIER' | 'ADMIN',
          walletAddress: address
        };

        if (authenticateWithSignature) {
          const signature = await authenticateWithSignature();
          if (signature) {
            login(userData, `wallet_token_${Date.now()}`);
            redirectBasedOnRole(selectedRole);
          }
        } else {
          login(userData, `wallet_token_${Date.now()}`);
          redirectBasedOnRole(selectedRole);
        }
      }
    } catch (err) {
      setError("Wallet registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "TRADER":
        router.push("/trader/dashboard");
        break;
      case "VERIFIER":
        router.push("/admin/dashboard");
        break;
      default:
        router.push("/dashboard");
    }
  };

  const handleRegistration = () => {
    if (!validateStep(2)) return;
    
    if (registrationMethod === "wallet") {
      handleWalletRegistration();
    } else {
      handleEmailRegistration();
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
              <span className="text-gray-600 text-sm">Already have an account?</span>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
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
          className="w-full max-w-2xl relative z-10"
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
              Join CLORION
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-body text-gray-600"
            >
              Create your account to start trading carbon credits
            </motion.p>
          </div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4">
              {registrationSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      currentStep >= step.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    )}>
                      {currentStep > step.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <p className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                      )}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < registrationSteps.length - 1 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-4 transition-all duration-300",
                      currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Role Selection */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-h4 mb-2">Choose Your Role</h3>
                        <p className="text-body-small text-gray-600">
                          Select the type of account that best describes your needs
                        </p>
                      </div>

                      <div className="space-y-4">
                        {roleOptions.map((role) => (
                          <motion.button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full p-6 rounded-xl border-2 transition-all duration-300 text-left",
                              selectedRole === role.id
                                ? "border-blue-500 bg-blue-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                            )}
                          >
                            <div className="flex items-start space-x-4">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                selectedRole === role.id 
                                  ? `bg-gradient-to-br ${role.color}` 
                                  : "bg-gray-100"
                              )}>
                                <role.icon className={cn(
                                  "w-6 h-6",
                                  selectedRole === role.id ? "text-white" : "text-gray-600"
                                )} />
                              </div>
                              <div className="flex-1">
                                <h4 className={cn(
                                  "font-semibold mb-1",
                                  selectedRole === role.id ? "text-blue-700" : "text-gray-900"
                                )}>
                                  {role.title}
                                </h4>
                                <p className="text-body-small text-gray-600 mb-3">
                                  {role.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {role.features.map((feature, index) => (
                                    <span
                                      key={index}
                                      className={cn(
                                        "px-2 py-1 rounded-md text-xs",
                                        selectedRole === role.id 
                                          ? "bg-blue-100 text-blue-700" 
                                          : "bg-gray-100 text-gray-600"
                                      )}
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="flex justify-end pt-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Account Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-h4 mb-2">Account Details</h3>
                        <p className="text-body-small text-gray-600">
                          Enter your information to create your account
                        </p>
                      </div>

                      {/* Registration Method Toggle */}
                      <div className="mb-6">
                        <div className="flex p-1 bg-gray-100 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setRegistrationMethod("email")}
                            className={cn(
                              "flex-1 py-2 px-4 rounded-lg text-body-small font-medium transition-all duration-300",
                              registrationMethod === "email"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                          >
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegistrationMethod("wallet")}
                            className={cn(
                              "flex-1 py-2 px-4 rounded-lg text-body-small font-medium transition-all duration-300",
                              registrationMethod === "wallet"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                          >
                            <Wallet className="w-4 h-4 inline mr-2" />
                            Wallet
                          </button>
                        </div>
                      </div>

                      {registrationMethod === "email" ? (
                        <div className="space-y-4">
                          {/* Name Input */}
                          <div className="space-y-2">
                            <label className="text-body-small font-medium text-gray-700">
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className={cn(
                                  "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                  validationErrors.name ? "border-red-300" : "border-gray-300"
                                )}
                              />
                            </div>
                            {validationErrors.name && (
                              <p className="text-red-600 text-xs mt-1">{validationErrors.name}</p>
                            )}
                          </div>

                          {/* Email Input */}
                          <div className="space-y-2">
                            <label className="text-body-small font-medium text-gray-700">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className={cn(
                                  "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                  validationErrors.email ? "border-red-300" : "border-gray-300"
                                )}
                              />
                            </div>
                            {validationErrors.email && (
                              <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>
                            )}
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
                                placeholder="Create a password"
                                className={cn(
                                  "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                  validationErrors.password ? "border-red-300" : "border-gray-300"
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {validationErrors.password && (
                              <p className="text-red-600 text-xs mt-1">{validationErrors.password}</p>
                            )}
                          </div>

                          {/* Confirm Password Input */}
                          <div className="space-y-2">
                            <label className="text-body-small font-medium text-gray-700">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className={cn(
                                  "w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                  validationErrors.confirmPassword ? "border-red-300" : "border-gray-300"
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {validationErrors.confirmPassword && (
                              <p className="text-red-600 text-xs mt-1">{validationErrors.confirmPassword}</p>
                            )}
                          </div>

                          {/* Terms Checkbox */}
                          <div className="space-y-2">
                            <label className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                              />
                              <span className="text-body-small text-gray-600">
                                I agree to the{" "}
                                <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                                  Privacy Policy
                                </Link>
                              </span>
                            </label>
                            {validationErrors.terms && (
                              <p className="text-red-600 text-xs mt-1">{validationErrors.terms}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Wallet className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-h4 mb-2">Connect Your Wallet</h4>
                            <p className="text-body-small text-gray-600 mb-6">
                              Connect your crypto wallet to create your account
                            </p>
                          </div>

                          {/* Optional Name for Wallet Users */}
                          <div className="space-y-2">
                            <label className="text-body-small font-medium text-gray-700">
                              Display Name (Optional)
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter a display name"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                              />
                            </div>
                          </div>

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
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handlePrevStep}
                            variant="outline"
                            className="px-6 py-2"
                          >
                            Back
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleRegistration}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating Account...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                Create Account
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </div>
                            )}
                          </Button>
                        </motion.div>
                      </div>
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
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center mt-8"
          >
            <p className="text-body-small text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
