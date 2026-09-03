import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthTokens } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('antihack_access_token');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to load authenticated user session', error);
          localStorage.removeItem('antihack_access_token');
          localStorage.removeItem('antihack_refresh_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const handleTokens = (tokens: AuthTokens) => {
    localStorage.setItem('antihack_access_token', tokens.access_token);
    localStorage.setItem('antihack_refresh_token', tokens.refresh_token);
    setUser(tokens.user);
  };

  const login = async (credentials: LoginPayload) => {
    const tokens = await authService.login(credentials);
    handleTokens(tokens);
  };

  const register = async (payload: RegisterPayload) => {
    const tokens = await authService.register(payload);
    handleTokens(tokens);
  };

  const logout = () => {
    localStorage.removeItem('antihack_access_token');
    localStorage.removeItem('antihack_refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
