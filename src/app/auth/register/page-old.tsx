"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Building,
  Shield,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Waves,
  Phone,
  MapPin,
  FileText,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "PROJECT_OWNER" | "TRADER" | "VERIFIER";

const roleInfo: Record<UserRole, {
  title: string;
  description: string;
  color: string;
  icon: any;
  features: string[];
}> = {
  PROJECT_OWNER: {
    title: "Project Owner / User",
    description: "Register and manage blue carbon projects",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Building,
    features: ["Submit project proposals", "Track project progress", "Manage your projects", "View approved credits", "User dashboard access"]
  },
  TRADER: {
    title: "Trader",
    description: "Buy and sell verified carbon credits",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Briefcase,
    features: ["Purchase carbon credits", "Portfolio management", "Market analytics", "Trading dashboard", "Transaction history"]
  },
  VERIFIER: {
    title: "Verifier / Administrator",
    description: "Verify projects and manage platform administration",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Shield,
    features: ["Approve/reject projects", "Verify carbon calculations", "Manage all users", "Admin dashboard access", "System oversight", "Platform administration"]
  }
};

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<UserRole>("PROJECT_OWNER");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organization: "",
    location: "",
    website: "",
    description: "",
    termsAccepted: false,
    newsLetterOptIn: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const role = searchParams.get("role") as UserRole;
    if (role && role in roleInfo) {
      setSelectedRole(role);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.email && 
           formData.password && formData.confirmPassword && 
           formData.password === formData.confirmPassword;
  };

  const validateStep2 = () => {
    if (selectedRole === "PROJECT_OWNER") {
      return formData.organization && formData.location && formData.description;
    }
    if (selectedRole === "VERIFIER") {
      return formData.organization && formData.description;
    }
    return true; // Traders don't need additional validation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Registration:", { ...formData, role: selectedRole });
      
      // Simulate successful registration
      alert("Registration successful! Please check your email for verification.");
      window.location.href = "/auth/login";
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/clorit-logo-new.png" 
                alt="CLORIT Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold text-gray-900">CLORIT</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
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
        <div className="w-full max-w-2xl">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CLORIT</h1>
            <p className="text-gray-600">
              Create your account to start trading verified blue carbon credits
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium",
                currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              )}>
                1
              </div>
              <div className={cn(
                "w-16 h-1 rounded-full",
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              )} />
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium",
                currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              )}>
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about yourself and choose your account type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Account Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(roleInfo).map(([role, info]) => {
                        const IconComponent = info.icon;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setSelectedRole(role as UserRole)}
                            className={cn(
                              "p-4 border-2 rounded-lg text-left transition-all",
                              selectedRole === role
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <IconComponent className="w-5 h-5 mt-1 text-blue-600" />
                              <div>
                                <h3 className="font-medium text-gray-900">{info.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep1()}
                      variant="gradient"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Additional Information */}
            {currentStep === 2 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Additional Information
                  </CardTitle>
                  <CardDescription>
                    Complete your profile for {roleInfo[selectedRole].title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Role Display */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Badge className={roleInfo[selectedRole].color}>
                        {roleInfo[selectedRole].title}
                      </Badge>
                      <span className="text-sm text-gray-600">{roleInfo[selectedRole].description}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Features included:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {roleInfo[selectedRole].features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location {(selectedRole === "PROJECT_OWNER") && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required={selectedRole === "PROJECT_OWNER"}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Organization Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization {(selectedRole !== "TRADER") && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        required={selectedRole !== "TRADER"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your organization name"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description {(selectedRole !== "TRADER") && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required={selectedRole !== "TRADER"}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        selectedRole === "PROJECT_OWNER" 
                          ? "Describe your organization and blue carbon projects..."
                          : selectedRole === "VERIFIER"
                          ? "Describe your expertise and verification experience..."
                          : "Tell us about yourself (optional)..."
                      }
                    />
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                          Terms of Service
                        </Link>
                        {" and "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="newsLetterOptIn"
                        checked={formData.newsLetterOptIn}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        I would like to receive updates about CLORIT and blue carbon initiatives
                      </span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!validateStep2() || !formData.termsAccepted || isLoading}
                      variant="gradient"
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                      {!isLoading && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
