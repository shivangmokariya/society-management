import { request, ApiResponse } from './api';

export interface DashboardData {
  society: any;
  dashboardStats: {
    currentBalance: string;
    detailedBalance: string;
    balanceTrend: string;
    monthlyIncome: string;
    monthlyIncomeTarget: string;
    financialProgressPercent: number;
    monthlyExpenses: string;
    pendingDuesFlats: number;
    totalInflow: string;
    totalOutflow: string;
    totalResidents: number;
    pendingComplaintsCount: number;
  };
  pendingApprovals: {
    count: number;
    item: {
      title: string;
      amount: string;
    };
  };
  attentionItems: Array<{
    _id: string;
    title: string;
    sub: string;
    type: 'error' | 'tertiary' | 'secondary' | 'info';
    icon: string;
  }>;
  recentActivities: Array<{
    _id: string;
    title: string;
    time: string;
    active: boolean;
  }>;
  upcomingEvents: Array<{
    _id: string;
    title: string;
    time: string;
    icon: string;
    bgClass: string;
  }>;
  recentTransactions: Array<any>;
}

export const societyService = {
  getSocietyDetails: async (token?: string): Promise<ApiResponse<any>> => {
    return await request('/society/details', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getDashboardData: async (token?: string): Promise<ApiResponse<DashboardData>> => {
    return await request<DashboardData>('/society/dashboard', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  updateSocietyDetails: async (societyId: string, data: any, token?: string): Promise<ApiResponse<any>> => {
    return await request(`/society/details/${societyId}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },
};
