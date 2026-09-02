import { Platform } from 'react-native';

// Default API Base URL based on platform
const getBaseHost = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/?$/, '');
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

export const API_HOST = getBaseHost();
export const API_BASE_URL = `${API_HOST}/api`;

export function getImageUrl(path?: string): string {
  if (!path) {
    return `${API_HOST}/public/assets/avatars/avatar_1.png`;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_HOST}${cleanPath}`;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw new Error(error.message || 'Network error or server offline');
  }
}
