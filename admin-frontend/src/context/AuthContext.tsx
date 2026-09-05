import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getMe, loginAdmin as loginApi } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('calm_admin_user');
    const expiry = localStorage.getItem('calm_admin_expiry');
    if (stored && expiry && Date.now() < Number(expiry)) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('calm_admin_token');
    const expiry = localStorage.getItem('calm_admin_expiry');
    if (storedToken && expiry && Date.now() < Number(expiry)) {
      return storedToken;
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('calm_admin_token');
      const expiry = localStorage.getItem('calm_admin_expiry');

      if (storedToken && expiry && Date.now() < Number(expiry)) {
        try {
          const userData = await getMe();
          setUser(userData);
          localStorage.setItem('calm_admin_user', JSON.stringify(userData));
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      } else if (storedToken || expiry) {
        logout();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const result = await loginApi(email, password, rememberMe);
    const { user: loggedUser, token: authToken, expiresInDays } = result.data;
    const days = expiresInDays || (rememberMe ? 30 : 7);
    const expiryTimestamp = Date.now() + days * 24 * 60 * 60 * 1000;
    
    setToken(authToken);
    setUser(loggedUser);
    localStorage.setItem('calm_admin_token', authToken);
    localStorage.setItem('calm_admin_user', JSON.stringify(loggedUser));
    localStorage.setItem('calm_admin_expiry', expiryTimestamp.toString());
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('calm_admin_token');
    localStorage.removeItem('calm_admin_user');
    localStorage.removeItem('calm_admin_expiry');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('calm_admin_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
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
