import { request, ApiResponse } from './api';
import { MaintenancePayment } from '../data/mockData';

export const paymentService = {
  getResidentPayments: async (residentId: string): Promise<ApiResponse<MaintenancePayment[]>> => {
    return await request<MaintenancePayment[]>(`/payments/resident/${residentId}`);
  },

  addResidentPayment: async (
    residentId: string,
    paymentData: {
      amount: number;
      paymentDate: string;
      dueDate: string;
      monthPeriod: string;
      paymentMethod?: string;
      payerName?: string;
      payerRole?: 'Owner' | 'Tenant';
    }
  ): Promise<ApiResponse<MaintenancePayment>> => {
    return await request<MaintenancePayment>(`/payments/resident/${residentId}`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};
