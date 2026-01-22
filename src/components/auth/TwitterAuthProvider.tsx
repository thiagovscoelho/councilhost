import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthApi, User } from '@/services/api/authApi';

interface AuthContextType {
  currentUser: User | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within TwitterAuthProvider');
  }
  return context;
}

interface TwitterAuthProviderProps {
  children: ReactNode;
}

export function TwitterAuthProvider({ children }: TwitterAuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const user = await AuthApi.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to check authentication:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    // Redirect to Twitter OAuth
    window.location.href = AuthApi.getTwitterAuthUrl();
  };

  const logout = async () => {
    try {
      await AuthApi.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    isAuthenticated: currentUser !== null,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
