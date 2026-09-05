import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile, LoginPayload, RegisterSecretaryPayload } from '../services/authService';
import { storage } from '../utils/storage';

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
  const [user, setUser] = useState<UserProfile | null>(() => {
    const storedUser = storage.getItem('calm_user');
    const storedExpiry = storage.getItem('calm_expiry');
    if (storedUser && storedExpiry && Date.now() < Number(storedExpiry)) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const storedToken = storage.getItem('calm_token');
    const storedExpiry = storage.getItem('calm_expiry');
    if (storedToken && storedExpiry && Date.now() < Number(storedExpiry)) {
      return storedToken;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore and verify session on initial app boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = storage.getItem('calm_token');
        const storedExpiry = storage.getItem('calm_expiry');

        if (storedToken && storedExpiry && Date.now() < Number(storedExpiry)) {
          setToken(storedToken);
          const res = await authService.getMe(storedToken);
          if (res.success && res.data) {
            setUser(res.data);
            storage.setItem('calm_user', JSON.stringify(res.data));
          } else {
            logout();
          }
        } else if (storedToken || storedExpiry) {
          logout();
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
    const res = await authService.login(payload);
    if (res.success && res.data) {
      const { token: newToken, user: newUser, expiresInDays } = res.data;
      const days = expiresInDays || (payload.rememberMe ? 30 : 7);
      const expiryTimestamp = Date.now() + days * 24 * 60 * 60 * 1000;

      setToken(newToken);
      setUser(newUser);
      storage.setItem('calm_token', newToken);
      storage.setItem('calm_user', JSON.stringify(newUser));
      storage.setItem('calm_expiry', expiryTimestamp.toString());
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const registerSecretary = async (payload: RegisterSecretaryPayload) => {
    const res = await authService.registerSecretary(payload);
    if (!res.success) {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const updateProfile = async (payload: { fullName?: string; phone?: string; avatarUrl?: string }) => {
    if (!token) throw new Error('Not authenticated');
    const res = await authService.updateProfile(token, payload);
    if (res.success && res.data) {
      setUser(res.data);
      storage.setItem('calm_user', JSON.stringify(res.data));
    } else {
      throw new Error(res.message || 'Profile update failed');
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
    storage.removeItem('calm_token');
    storage.removeItem('calm_user');
    storage.removeItem('calm_expiry');
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
