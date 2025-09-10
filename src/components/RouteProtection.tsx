"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface RouteProtectionProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RouteProtection({ children, allowedRoles, redirectTo = '/dashboard' }: RouteProtectionProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get user from localStorage (in real app, use proper auth context)
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          // No user logged in, redirect to login
          router.push('/auth/login');
          return;
        }

        const user = JSON.parse(userData);
        
        if (!allowedRoles.includes(user.role)) {
          // User doesn't have permission, redirect
          router.push(redirectTo);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}
