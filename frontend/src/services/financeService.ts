import { request, ApiResponse } from './api';

export interface FinanceSummaryData {
  currentBalance: string;
  detailedBalance: string;
  balanceTrend: string;
  monthlyIncome: string;
  monthlyIncomeTarget: string;
  financialProgressPercent: number;
  monthlyExpenses: string;
  totalInflow: string;
  totalOutflow: string;
  pendingDuesCount: number;
  pendingDues: any[];
  majorExpenses: Array<{
    category: string;
    amount: string;
    percentage: number;
    color: string;
  }>;
}

export interface TransactionItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  isCredit: boolean;
}

export const financeService = {
  getSummary: async (): Promise<ApiResponse<FinanceSummaryData>> => {
    return await request<FinanceSummaryData>('/finance/summary');
  },

  getTransactions: async (params?: { category?: string; search?: string }): Promise<ApiResponse<TransactionItem[]>> => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await request<TransactionItem[]>(`/finance/transactions${queryString}`);
  },

  createTransaction: async (payload: { title: string; category: string; amount: number; isCredit: boolean }): Promise<ApiResponse<TransactionItem>> => {
    return await request<TransactionItem>('/finance/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
