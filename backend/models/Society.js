const mongoose = require('mongoose');

const attentionItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sub: { type: String, required: true },
  type: { type: String, enum: ['error', 'tertiary', 'secondary', 'info'], default: 'info' },
  icon: { type: String, default: 'info' },
});

const recentActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  active: { type: Boolean, default: false },
});

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Society name is required'],
      trim: true,
    },
    secretaryName: {
      type: String,
      required: true,
      default: 'Rajesh',
    },
    secretaryFullName: {
      type: String,
      required: true,
      default: 'Rajesh Patel',
    },
    secretaryRole: {
      type: String,
      default: 'Society Secretary',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    loginCardLogoUrl: {
      type: String,
      default: '',
    },
    profileAvatarUrl: {
      type: String,
      default: '',
    },
    // Financial overview statistics
    currentBalance: { type: Number, default: 1245000 },
    detailedBalance: { type: Number, default: 1245200 },
    balanceTrend: { type: String, default: '+2.4% vs last month' },
    monthlyIncome: { type: Number, default: 265000 },
    monthlyIncomeTarget: { type: Number, default: 300000 },
    financialProgressPercent: { type: Number, default: 90 },
    monthlyExpenses: { type: Number, default: 82450 },
    pendingDuesFlats: { type: Number, default: 12 },
    totalInflow: { type: Number, default: 315000 },
    totalOutflow: { type: Number, default: 133500 },

    // Approvals
    pendingApprovalsCount: { type: Number, default: 1 },
    pendingApprovalItem: {
      title: { type: String, default: 'New Fire Extinguishers' },
      amount: { type: String, default: '₹15,000' },
    },

    // Attention items & Recent Activities
    attentionItems: [attentionItemSchema],
    recentActivities: [recentActivitySchema],

    // Water Management metrics
    waterLastCleaned: { type: String, default: '12 Aug' },
    waterNextDue: { type: String, default: '15 Sep' },

    // Staff Attendance
    staffAttendance: {
      presentCount: { type: Number, default: 12 },
      totalCount: { type: Number, default: 14 },
    },

    // Society Maintenance Settings (Configured by Secretary)
    maintenanceAmount: { type: Number, default: 2500 },
    maintenanceDueDate: { type: String, default: '5th of every month' },
    monthSchedule: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Society', societySchema);
