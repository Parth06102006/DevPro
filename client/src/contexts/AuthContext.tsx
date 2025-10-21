import React, { createContext, useContext, useEffect, useState,  } from 'react';
import { type User } from '../services/authService';
import { checkAuth, login as apiLogin, logout as apiLogout, signUp as apiSignUp } from '../services/authService';
import type { LoginData, SignupData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (signupData: SignupData) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await checkAuth();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginData: LoginData) => {
    try {
      setIsLoading(true);
      await apiLogin(loginData);
      // After successful login, check auth status to get user data
      await checkAuthStatus();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (signupData: SignupData) => {
    try {
      setIsLoading(true);
      await apiSignUp(signupData);
      // After successful signup, user needs to login
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiLogout();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signUp,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};