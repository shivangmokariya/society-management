import api from './api';
import { SecretaryRegistration, Resident, Complaint, WaterTank, WaterTanker, Society } from '../types';

export const getSecretaryRegistrations = async (status?: string) => {
  const params = status ? { status } : {};
  const response = await api.get('/auth/secretary-registrations', { params });
  return response.data.data as SecretaryRegistration[];
};

export const getSecretaryById = async (id: string) => {
  const registrations = await getSecretaryRegistrations();
  return registrations.find((r) => r._id === id);
};

export const approveSecretaryRequest = async (id: string, customPassword?: string) => {
  const response = await api.post(`/auth/approve-secretary/${id}`, { customPassword });
  return response.data;
};

export const rejectSecretaryRequest = async (id: string) => {
  const response = await api.post(`/auth/reject-secretary/${id}`);
  return response.data;
};

export const getApprovedSecretaries = async () => {
  const registrations = await getSecretaryRegistrations('Approved');
  return registrations;
};

// Society & On-Behalf Dashboard API Services
export const getSocietyDetails = async (societyId?: string) => {
  const params = societyId ? { societyId } : {};
  const response = await api.get('/society/details', { params });
  return response.data.data as Society;
};

export const getSocietyDashboardData = async (societyId?: string) => {
  const params = societyId ? { societyId } : {};
  const response = await api.get('/society/dashboard', { params });
  return response.data.data;
};

export const updateSocietyProfile = async (id: string, data: Partial<Society>) => {
  const response = await api.put(`/society/details/${id}`, data);
  return response.data.data as Society;
};

// Resident Management (Owners & Tenants)
export const getSocietyResidents = async (societyId?: string, search?: string) => {
  const params: Record<string, string> = {};
  if (societyId) params.societyId = societyId;
  if (search) params.search = search;
  const response = await api.get('/residents', { params });
  return response.data.data as Resident[];
};

export const addOwner = async (data: {
  fullName: string;
  phone: string;
  flatNumber: string;
  email?: string;
  societyId?: string;
}) => {
  const response = await api.post('/residents/owner', data);
  return response.data.data as Resident;
};

export const addTenant = async (data: {
  fullName: string;
  phone: string;
  flatAssignment: string;
  moveInDate?: string;
  societyId?: string;
}) => {
  const response = await api.post('/residents/tenant', data);
  return response.data.data as Resident;
};

export const deleteResident = async (id: string) => {
  const response = await api.delete(`/residents/${id}`);
  return response.data;
};

// Complaints Management
export const getSocietyComplaints = async (societyId?: string, search?: string) => {
  const params: Record<string, string> = {};
  if (societyId) params.societyId = societyId;
  if (search) params.search = search;
  const response = await api.get('/operations/complaints', { params });
  return response.data.data as Complaint[];
};

export const createComplaint = async (data: {
  title: string;
  category: string;
  flat: string;
  description?: string;
  reportedBy?: string;
  societyId?: string;
}) => {
  const response = await api.post('/operations/complaints', data);
  return response.data.data as Complaint;
};

export const updateComplaintStatus = async (id: string, status: string) => {
  const response = await api.patch(`/operations/complaints/${id}/status`, { status });
  return response.data.data as Complaint;
};

// Water Tank & Tanker Operations
export const getSocietyWaterTanks = async (societyId?: string) => {
  const params = societyId ? { societyId } : {};
  const response = await api.get('/operations/water-tanks', { params });
  return response.data.data as { tanks: WaterTank[]; waterLastCleaned: string; waterNextDue: string };
};

export const getSocietyWaterTankers = async (societyId?: string) => {
  const params = societyId ? { societyId } : {};
  const response = await api.get('/operations/water-tankers', { params });
  return response.data.data as WaterTanker[];
};

export const recordWaterTanker = async (data: {
  supplier: string;
  capacity: string;
  arrivalDate?: string;
  notes?: string;
  societyId?: string;
}) => {
  const response = await api.post('/operations/record-tanker', data);
  return response.data.data as WaterTanker;
};
