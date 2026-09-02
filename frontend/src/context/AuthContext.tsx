import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile, LoginPayload, RegisterSecretaryPayload } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registerSecretary: (payload: RegisterSecretaryPayload) => Promise<void>;
  updateProfile: (payload: { fullName?: string; phone?: string; avatarUrl?: string }) => Promise<void>;
  uploadAvatar: (formData: FormData) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on initial app boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (token) {
          const res = await authService.getMe(token);
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerSecretary = async (payload: RegisterSecretaryPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.registerSecretary(payload);
      if (!res.success) {
        throw new Error(res.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (payload: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    if (!token) throw new Error('Not authenticated');
    setIsLoading(true);
    try {
      const res = await authService.updateProfile(token, payload);
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        throw new Error(res.message || 'Profile update failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (formData: FormData): Promise<string> => {
    if (!token) throw new Error('Not authenticated');
    const res = await authService.uploadAvatar(token, formData);
    if (res.success && res.data?.avatarUrl) {
      return res.data.avatarUrl;
    } else {
      throw new Error(res.message || 'Avatar upload failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        registerSecretary,
        updateProfile,
        uploadAvatar,
        logout,
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
