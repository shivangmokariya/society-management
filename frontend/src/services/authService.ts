import { request, ApiResponse } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterSecretaryPayload {
  fullName: string;
  societyName: string;
  email: string;
  phone: string;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  society?: any;
  avatarUrl?: string;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
}

export const authService = {
  // Login user
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
    return await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Register secretary request
  registerSecretary: async (payload: RegisterSecretaryPayload): Promise<ApiResponse<any>> => {
    return await request('/auth/register-secretary', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Fetch current user profile
  getMe: async (token: string): Promise<ApiResponse<UserProfile>> => {
    return await request<UserProfile>('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateProfile: async (token: string, payload: { fullName?: string; phone?: string; avatarUrl?: string }): Promise<ApiResponse<UserProfile>> => {
    return await request<UserProfile>('/auth/me', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  // Upload custom profile avatar image file
  uploadAvatar: async (token: string, formData: FormData): Promise<ApiResponse<{ avatarUrl: string }>> => {
    return await request<{ avatarUrl: string }>('/auth/upload-avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  },

  // Request password reset link
  forgotPassword: async (email: string): Promise<ApiResponse<{ resetToken?: string; email?: string }>> => {
    return await request<{ resetToken?: string; email?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password using email reset token
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<any>> => {
    return await request<any>(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },
};
