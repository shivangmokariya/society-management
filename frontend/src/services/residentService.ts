import { request, ApiResponse } from './api';

export interface ResidentItem {
  _id: string;
  flat: string;
  block: string;
  status: 'Occupied' | 'Vacant';
  paymentStatus: 'Paid' | 'Pending' | 'No Dues';
  pendingAmount?: string;
  ownerName: string;
  residentName: string;
  phone: string;
  email?: string;
  isSelfOwner?: boolean;
  avatarUrl?: string;
}

export const residentService = {
  getResidents: async (params?: { search?: string; block?: string; status?: string }): Promise<ApiResponse<ResidentItem[]>> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.block) query.append('block', params.block);
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await request<ResidentItem[]>(`/residents${queryString}`);
  },

  addOwner: async (payload: { fullName: string; flatNumber: string; phone: string; email?: string }): Promise<ApiResponse<ResidentItem>> => {
    return await request<ResidentItem>('/residents/owner', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  addTenant: async (payload: { fullName: string; flatAssignment: string; phone: string; moveInDate?: string }): Promise<ApiResponse<ResidentItem>> => {
    return await request<ResidentItem>('/residents/tenant', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
