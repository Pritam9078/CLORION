"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsers } from '@/data/mockUser';

export function RoleTestingPanel() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const switchUser = (userType: keyof typeof mockUsers) => {
    const userData = mockUsers[userType];
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    
    // Redirect based on role
    if (userData.role === 'VERIFIER') {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const clearUser = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.href = '/auth/login';
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>🧪 Role Testing Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Use this panel to quickly switch between different user roles for testing:
        </div>
        
        <Button 
          onClick={() => switchUser('projectOwner')} 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Login as Project Owner
        </Button>
        
        <Button 
          onClick={() => switchUser('trader')} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Login as Trader
        </Button>
        
        <Button 
          onClick={() => switchUser('verifier')} 
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Login as Verifier/Admin
        </Button>
        
        <Button 
          onClick={clearUser} 
          variant="outline" 
          className="w-full"
        >
          Logout & Clear Session
        </Button>
        
        {currentUser && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <strong>Current User:</strong> {currentUser.name}
              <br />
              <strong>Role:</strong> {currentUser.role}
              <br />
              <strong>Email:</strong> {currentUser.email}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
