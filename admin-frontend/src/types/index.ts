export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Secretary' | 'Owner' | 'Tenant';
  avatarUrl?: string;
  society?: Society | string;
  createdAt?: string;
}

export interface SecretaryRegistration {
  _id: string;
  fullName: string;
  societyName: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface Society {
  _id: string;
  name: string;
  secretaryName?: string;
  secretaryFullName?: string;
  secretaryRole?: string;
  logoUrl?: string;
  loginCardLogoUrl?: string;
  profileAvatarUrl?: string;
  currentBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  maintenanceAmount?: number;
  maintenanceDueDate?: string;
  waterLastCleaned?: string;
  waterNextDue?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'access_request' | 'system' | 'complaint' | 'alert';
  timestamp: string;
  read: boolean;
  route?: string;
  relatedId?: string;
}

export interface Resident {
  _id: string;
  flat: string;
  block: string;
  status: 'Occupied' | 'Vacant' | 'Rented';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'No Dues';
  ownerName: string;
  residentName: string;
  phone: string;
  email?: string;
  isSelfOwner?: boolean;
  moveInDate?: string;
  society?: string;
  createdAt?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  category: string;
  flat: string;
  reportedBy: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  timeAgo?: string;
  createdAt?: string;
}

export interface WaterTank {
  _id: string;
  name: string;
  capacity?: string;
  currentLevel?: number;
  status?: string;
}

export interface WaterTanker {
  _id: string;
  arrivalDate: string;
  capacity: string;
  supplier: string;
  notes?: string;
  createdAt?: string;
}
