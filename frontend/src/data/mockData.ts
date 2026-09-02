export interface Resident {
  id: string;
  flat: string;
  block: string;
  status: 'Occupied' | 'Vacant';
  paymentStatus: 'Paid' | 'Pending' | 'No Dues';
  pendingAmount?: string;
  ownerName: string;
  residentName: string;
  phone: string;
  isSelfOwner?: boolean;
  avatarUrl?: string;
}

export interface Complaint {
  id?: string;
  _id?: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Security' | 'General';
  flat: string;
  description?: string;
  timeAgo: string;
  status: 'In Progress' | 'Open' | 'Resolved';
}

export interface Transaction {
  id: string;
  title: string;
  category: 'Electricity' | 'Maintenance' | 'Plumbing' | 'Security';
  date: string;
  amount: string;
  isCredit: boolean;
}

export interface Asset {
  id: string;
  name: string;
  status: 'Active' | 'Service Due' | 'Inactive';
  icon: string;
}

export interface MaintenancePayment {
  id?: string;
  _id?: string;
  residentId?: string;
  flat: string;
  payerName: string;
  payerRole: 'Owner' | 'Tenant';
  amount: number | string;
  paymentDate: string;
  dueDate: string;
  status: 'On Time' | 'Late' | 'Pending';
  monthPeriod: string;
  paymentMethod?: string;
}

export const initialSocietyData = {
  name: "Green View Society",
  secretaryName: "Rajesh",
  secretaryFullName: "Rajesh Patel",
  secretaryRole: "Society Secretary",
  maintenanceAmount: 2500,
  maintenanceDueDate: "5th of every month",
  monthSchedule: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5 } as { [key: number]: number },
  logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBM9_DNXZ8koxKRwegQ0iXsISxUFUcSo5dsm78f9M2vuU8L7Jzit5hOxxuBiwjYfv9PFp7fw_R24DsPbA4Uy4XzzqKEZaBl84NqmQq56mxD99nBxPK21OOZckIwmH_HHoCNcLJcQ5RNP4XUg0ZYYTwxmwNj918Cu4I4RfrlMSyHvNCmnBApd0MW5FTpaxzYibgKkkZWa52QirGm9v80WXPgSyb3uF2jMpacLSmNHM2wDLYvT4K4F-Wo",
  loginCardLogoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1VibAv-sqoMZrVsfGQJJoMsVTBbTgm6SHOGsu-EKdmfinflGzxyUi_sjxmCawT_y7kt-ub214ZGgnEH2-uWmLFEosLEgMua-uknU-RKIiMR4pyOJHf9DyLh04l7r8xnc0cizJW4atf4sy6PEM-rBTgqLYH46mWWeaPzFmdOysnqPF5C6cNfv-Jxgx2bp4_2Ve1CeRfu96krYv0PXZ8eznn9fHTY09xY4InJz6VDUhcAN1feunCOHgPvtFY",
  profileAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe_WlUEKszuKTSUFIQK37z347bxAL5xwJsxRtkSYwRzkmk0RmCSXoQSiZH5rx-oFg5_k9Dk-fktyElDjNoLzKk1wjFczNvPRw4UlITNMsMBabLN9dOeV72c0wVgSN5oABclmuVzDLsOr8jQl59fsrXNzHKfE3RdXwXQBfYcjcDzj6EOjL6Hyl5EypDFMye3GdZIJ3rC-Tx0himWPeNxklFSChlGeOmx3e1Va3D4wB7UqUWBC1orzJ2",
  
  // Dashboard & Finance Stats
  currentBalance: "₹12,45,000",
  detailedBalance: "₹12,45,200",
  balanceTrend: "+2.4% vs last month",
  monthlyIncome: "₹2,65,000",
  monthlyIncomeTarget: "₹3,00,000",
  financialProgressPercent: 90,
  monthlyExpenses: "₹82,450",
  pendingDuesFlats: 12,
  totalInflow: "₹3,15,000",
  totalOutflow: "₹1,33,500",

  // Approvals & Tasks
  pendingApprovalsCount: 1,
  pendingApprovalItem: {
    title: "New Fire Extinguishers",
    amount: "₹15,000",
  },
  
  attentionItems: [
    { id: '1', title: 'Lift AMC expires in 12 days', sub: 'Review contract for Tower A & B', type: 'error', icon: 'elevator' },
    { id: '2', title: '7 complaints pending', sub: '3 plumbing, 4 electrical issues', type: 'tertiary', icon: 'report_problem' },
    { id: '3', title: 'Water tank cleaning due', sub: 'Scheduled in 5 days', type: 'secondary', icon: 'water_drop' },
  ],

  recentActivities: [
    { id: '1', title: 'Pump repaired', time: '2 hours ago', active: true },
    { id: '2', title: 'Electricity bill paid', time: 'Yesterday, 4:30 PM', active: false },
    { id: '3', title: 'New tenant added (B-402)', time: 'Oct 12, 10:00 AM', active: false },
  ],

  upcomingEvents: [
    { id: '1', title: 'Committee Mtg.', time: 'Tomorrow, 7 PM', icon: 'groups', bgClass: 'primaryContainer' },
    { id: '2', title: 'Navratri Event', time: 'Oct 15 - Oct 23', icon: 'celebration', bgClass: 'secondaryContainer' },
  ],

  majorExpenses: [
    { category: 'Security', amount: '₹90,000', percentage: 67, color: '#3f6651' },
    { category: 'Cleaning', amount: '₹25,000', percentage: 18, color: '#31666b' },
    { category: 'Electricity', amount: '₹18,500', percentage: 15, color: '#48607d' },
  ],

  transactions: [
    { id: 't1', title: 'Electricity Bill Paid', category: 'Electricity', date: 'Today, 10:24 AM', amount: '-₹18,500', isCredit: false },
    { id: 't2', title: 'Maintenance A-302', category: 'Maintenance', date: 'Yesterday', amount: '+₹4,500', isCredit: true },
    { id: 't3', title: 'Plumbing Repair', category: 'Plumbing', date: 'Oct 12', amount: '-₹2,200', isCredit: false },
  ] as Transaction[],

  // Directory / People
  residents: [
    {
      id: 'res-1',
      flat: 'A-302',
      block: 'Block A',
      status: 'Occupied',
      paymentStatus: 'Paid',
      ownerName: 'Rajesh Patel',
      residentName: 'Amit Shah',
      phone: '+91 98200 12345',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf6pgYsQxyzAP44eg2R35g4tDXLExrfSER-uXWmU8vRn6SGSUYzRCjHGqM82EeP8AalA2fOgmWVp12nDZ_hvqXtOhln-yi1apqgF17ULkeJk_d-Hju1_dZJCUGbQRgbvoV4cXDV5vvg65MWrFCJzxuCYnUr-40xNpncYR4h8Fzl2aNFivDmVV-Kgn3evbx7aObh8ICaRTpbiiEcgSucFYICWYQCTSc887LekFXwgLbfko0VMG4aKee',
    },
    {
      id: 'res-2',
      flat: 'B-105',
      block: 'Block B',
      status: 'Occupied',
      paymentStatus: 'Pending',
      pendingAmount: '₹2,500 due',
      ownerName: 'Sunita Rao',
      residentName: 'Sunita Rao',
      isSelfOwner: true,
      phone: '+91 98330 67890',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxx39N8108EV1tXCJHWxEGS_KuVacTfi_-X1iqWxuGtfQ4kDaKJDlz_tHLYNSEdKnsc5_ImvPruR8HyPFIL8A_bMVR-OZ5mMsCobWSdiUiAvuOAayYclN2RZWJw8NurzQylxP2ZQffZwpSKFQPb0Vm0p4fJHsKjCSmvwsQ_ZmQ1r4AW6eUT8TgQG79jtM0Lv5LZiK2pGSohGAA4_pxdXnx0f6lWjAHBOSjHRHz7FvDppCgbTyZo97N',
    },
    {
      id: 'res-3',
      flat: 'C-401',
      block: 'Block C',
      status: 'Vacant',
      paymentStatus: 'No Dues',
      ownerName: 'Society Management',
      residentName: 'Available for rent',
      phone: '',
    },
  ] as Resident[],

  // Operations
  complaints: [
    { id: 'c1', title: 'Water leakage A-302', category: 'Plumbing', flat: 'A-302', timeAgo: 'Reported 2h ago', status: 'In Progress' },
    { id: 'c2', title: 'Lift noise B-wing', category: 'Electrical', flat: 'B-wing', timeAgo: 'Reported 5h ago', status: 'Open' },
  ] as Complaint[],

  waterTanks: [
    { id: 'tank-1', name: 'Tank 1', levelPercent: 85, color: '#879fbf' },
    { id: 'tank-2', name: 'Tank 2', levelPercent: 40, color: '#48607d' },
  ],
  waterLastCleaned: '12 Aug',
  waterNextDue: '15 Sep',

  assets: [
    { id: 'ast-1', name: 'Generator', status: 'Active', icon: 'bolt' },
    { id: 'ast-2', name: 'CCTVs (24)', status: 'Active', icon: 'videocam' },
    { id: 'ast-3', name: 'Lift 1 (A-wing)', status: 'Service Due', icon: 'elevator' },
  ] as Asset[],

  staffAttendance: {
    presentCount: 12,
    totalCount: 14,
  },

  maintenancePayments: [
    {
      id: 'pay-1',
      residentId: 'res-1',
      flat: 'A-302',
      payerName: 'Amit Shah',
      payerRole: 'Tenant',
      amount: 2500,
      paymentDate: '2026-08-03',
      dueDate: '2026-08-05',
      status: 'On Time',
      monthPeriod: 'August 2026',
      paymentMethod: 'UPI',
    },
    {
      id: 'pay-2',
      residentId: 'res-1',
      flat: 'A-302',
      payerName: 'Amit Shah',
      payerRole: 'Tenant',
      amount: 2500,
      paymentDate: '2026-07-11',
      dueDate: '2026-07-05',
      status: 'Late',
      monthPeriod: 'July 2026',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'pay-3',
      residentId: 'res-2',
      flat: 'B-105',
      payerName: 'Sunita Rao',
      payerRole: 'Owner',
      amount: 2500,
      paymentDate: '2026-07-04',
      dueDate: '2026-07-05',
      status: 'On Time',
      monthPeriod: 'July 2026',
      paymentMethod: 'UPI',
    },
  ] as MaintenancePayment[],
};
