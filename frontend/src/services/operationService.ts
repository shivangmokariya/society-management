import { request, ApiResponse } from './api';

export interface ComplaintItem {
  _id?: string;
  id?: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Security' | 'General';
  flat: string;
  description?: string;
  timeAgo: string;
  status: 'In Progress' | 'Open' | 'Resolved';
}

export interface AssetItem {
  _id: string;
  name: string;
  status: 'Active' | 'Service Due' | 'Inactive';
  icon: string;
}

export interface WaterTankItem {
  _id: string;
  name: string;
  levelPercent: number;
  color: string;
}

export interface WaterTankData {
  tanks: WaterTankItem[];
  waterLastCleaned: string;
  waterNextDue: string;
}

export const operationService = {
  getComplaints: async (): Promise<ApiResponse<ComplaintItem[]>> => {
    return await request<ComplaintItem[]>('/operations/complaints');
  },

  createComplaint: async (data: {
    title: string;
    category?: string;
    flat?: string;
    description?: string;
    reportedBy?: string;
  }): Promise<ApiResponse<ComplaintItem>> => {
    return await request<ComplaintItem>('/operations/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateComplaintStatus: async (id: string, status: string): Promise<ApiResponse<ComplaintItem>> => {
    return await request<ComplaintItem>(`/operations/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getAssets: async (): Promise<ApiResponse<AssetItem[]>> => {
    return await request<AssetItem[]>('/operations/assets');
  },

  getWaterTanks: async (): Promise<ApiResponse<WaterTankData>> => {
    return await request<WaterTankData>('/operations/water-tanks');
  },

  recordTanker: async (data: {
    arrivalDate: string;
    capacity?: string;
    supplier?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> => {
    return await request<any>('/operations/record-tanker', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
