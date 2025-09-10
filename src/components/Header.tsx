"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X, User, LogOut, Settings, ChevronDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
    walletAddress?: string;
  } | null;
}

export function Header({ user: propUser }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Try to use auth context but fallback gracefully
  let contextUser = null;
  let authLogout = null;
  try {
    const auth = useAuth();
    contextUser = auth.user;
    authLogout = auth.logout;
  } catch (error) {
    // AuthProvider not available, use prop user
    console.log("AuthProvider not available, using prop user");
  }
  
  const user = contextUser || propUser;
  
  // Web3 wallet connection
  const { address, isConnected, connectWallet, disconnectWallet, isLoading } = useWalletConnection();

    const navigation = [
    { name: "Dashboard", href: user?.role === "TRADER" ? "/trader/dashboard" : "/dashboard", roles: ["PROJECT_OWNER", "TRADER"] },
    { name: "Projects", href: "/projects", roles: ["PROJECT_OWNER", "TRADER", "VERIFIER"] },
    { 
      name: user?.role === "PROJECT_OWNER" ? "Buy Credits" : "Marketplace", 
      href: user?.role === "PROJECT_OWNER" ? "/project-owner/buy-credits" : "/marketplace", 
      roles: ["TRADER", "PROJECT_OWNER"] 
    },
    { name: "Verification", href: "/verification", roles: ["VERIFIER"] },
    { name: "Enterprise", href: "/enterprise", roles: ["VERIFIER", "PROJECT_OWNER"] },
    { name: "Analytics", href: "/analytics", roles: ["VERIFIER", "PROJECT_OWNER", "TRADER"] },
  ];

  const filteredNavigation = navigation.filter(item => 
    !user || item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    try {
      // Close the user menu
      setIsUserMenuOpen(false);
      
      // Disconnect wallet if connected
      if (isConnected) {
        await disconnectWallet();
      }
      
      // Use auth context logout if available, otherwise fallback to manual logout
      if (authLogout) {
        await authLogout();
      } else {
        // Fallback manual logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Redirect manually
        window.location.href = '/auth/login';
      }
      
      console.log("Successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/clorion-logo.png" 
              alt="CLORION Logo" 
              className="w-8 h-8 rounded-lg object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              CLORION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  pathname.startsWith(item.href)
                    ? "text-blue-600"
                    : "text-gray-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 capitalize">{user.role.replace('_', ' ')}</p>
                      
                      {/* Wallet Status */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        {isConnected && address ? (
                          <div className="flex items-center gap-2">
                            <Wallet className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">
                              {address.slice(0, 6)}...{address.slice(-4)}
                            </span>
                            <Badge variant="secondary" className="text-xs">Connected</Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Wallet className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">No wallet connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Wallet Actions */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      {isConnected ? (
                        <button
                          onClick={disconnectWallet}
                          className="flex items-center w-full text-xs text-red-600 hover:text-red-800"
                          disabled={isLoading}
                        >
                          <Wallet className="w-3 h-3 mr-2" />
                          Disconnect Wallet
                        </button>
                      ) : (
                        <button
                          onClick={connectWallet}
                          className="flex items-center w-full text-xs text-blue-600 hover:text-blue-800"
                          disabled={isLoading}
                        >
                          <Wallet className="w-3 h-3 mr-2" />
                          {isLoading ? "Connecting..." : "Connect Wallet"}
                        </button>
                      )}
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Wallet Connection for Non-logged users */}
                {isConnected && address ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                    <button
                      onClick={disconnectWallet}
                      className="text-xs text-red-600 hover:text-red-800 ml-2"
                      disabled={isLoading}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={connectWallet}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
                
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="gradient">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button variant="gradient" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
