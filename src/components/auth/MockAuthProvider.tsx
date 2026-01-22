import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService, STORAGE_KEYS } from '@/services/storageService';

interface AuthContextType {
  currentUser: string | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within MockAuthProvider');
  }
  return context;
}

interface MockAuthProviderProps {
  children: ReactNode;
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = StorageService.get<string>(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const login = (username: string) => {
    setCurrentUser(username);
    StorageService.set(STORAGE_KEYS.CURRENT_USER, username);
  };

  const logout = () => {
    setCurrentUser(null);
    StorageService.remove(STORAGE_KEYS.CURRENT_USER);
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    isAuthenticated: currentUser !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
