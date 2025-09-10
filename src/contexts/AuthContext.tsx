"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  name: string;
  email: string;
  role: 'PROJECT_OWNER' | 'TRADER' | 'VERIFIER' | 'ADMIN';
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token?: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Only access localStorage on client side
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear invalid data safely
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      }
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear user state
      setUser(null);
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Clear session storage
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Call backend logout endpoint if available
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (error) {
        console.error('Backend logout error:', error);
        // Continue with client-side logout even if backend fails
      }
      
      // Redirect to login page
      router.push('/auth/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still redirect to login
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}