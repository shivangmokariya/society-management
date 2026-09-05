import api from './api';
import { User } from '../types';

export const loginAdmin = async (email: string, password: string, rememberMe: boolean = false) => {
  const response = await api.post('/auth/login', { email, password, rememberMe });
  return response.data; // { success: true, data: { user, token, expiresInDays } }
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data as User;
};

export const updateMe = async (data: { fullName?: string; phone?: string; avatarUrl?: string }) => {
  const response = await api.put('/auth/me', data);
  return response.data.data as User;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/auth/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data; // { avatarUrl: string }
};
