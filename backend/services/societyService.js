const Society = require('../models/Society');
const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');
const Event = require('../models/Event');
const Resident = require('../models/Resident');
const ApiError = require('../utils/apiError');

class SocietyService {
  async getSocietyDetails(societyId) {
    let society = null;
    const mongoose = require('mongoose');

    if (societyId) {
      if (mongoose.Types.ObjectId.isValid(societyId)) {
        society = await Society.findById(societyId);
      }
      if (!society) {
        // Try looking up SecretaryRegistration
        const SecretaryRegistration = require('../models/SecretaryRegistration');
        if (mongoose.Types.ObjectId.isValid(societyId)) {
          const reg = await SecretaryRegistration.findById(societyId);
          if (reg) {
            society = await Society.findOne({ name: reg.societyName });
          }
        }
      }
      if (!society) {
        society = await Society.findOne({ name: societyId });
      }
    }

    if (!society) {
      society = await Society.findOne();
    }

    if (!society) {
      throw ApiError.notFound('Society data not found');
    }
    return society;
  }

  async getDashboardData(societyId) {
    const society = await this.getSocietyDetails(societyId);
    const mongoose = require('mongoose');

    // Find all related society IDs for matching name variations
    const baseName = society.name.toLowerCase().replace(/\s+society$/i, '').trim();
    const relatedSocieties = await Society.find({
      name: { $regex: new RegExp(`^${baseName}`, 'i') }
    });
    let societyIds = relatedSocieties.map((s) => s._id);
    if (!societyIds.some((id) => id.toString() === society._id.toString())) {
      societyIds.push(society._id);
    }

    const societyQuery = {
      $or: [
        { society: { $in: societyIds } },
        { society: { $exists: false } },
        { society: null },
      ]
    };

    // 1. Transactions Aggregation
    const transactions = await Transaction.find(societyQuery).sort({ createdAt: -1 });
    const recentTransactions = transactions.slice(0, 5);

    let creditSum = 0;
    let debitSum = 0;
    transactions.forEach((t) => {
      if (t.isCredit) {
        creditSum += t.amount || 0;
      } else {
        debitSum += t.amount || 0;
      }
    });

    const baseBalance = society.currentBalance || 0;
    const incomeVal = creditSum > 0 ? creditSum : (society.monthlyIncome || 0);
    const expensesVal = debitSum > 0 ? debitSum : (society.monthlyExpenses || 0);
    const currentBalVal = baseBalance + creditSum - debitSum;

    // 2. Complaints Count
    const pendingComplaintsCount = await Complaint.countDocuments({
      ...societyQuery,
      status: { $ne: 'Resolved' },
    });

    // 3. Events
    const upcomingEvents = await Event.find(societyQuery).limit(5);

    // 4. Residents & Dues
    const totalResidents = await Resident.countDocuments(societyQuery);
    const pendingDuesCount = await Resident.countDocuments({
      ...societyQuery,
      paymentStatus: { $in: ['Pending', 'Overdue'] },
    });

    const targetIncome = society.monthlyIncomeTarget || 300000;
    const progressPercent = targetIncome > 0 ? Math.min(100, Math.round((incomeVal / targetIncome) * 100)) : 0;

    return {
      society,
      dashboardStats: {
        currentBalance: `₹${currentBalVal.toLocaleString('en-IN')}`,
        detailedBalance: `₹${currentBalVal.toLocaleString('en-IN')}`,
        balanceTrend: society.balanceTrend || '0% vs last month',
        monthlyIncome: `₹${incomeVal.toLocaleString('en-IN')}`,
        monthlyIncomeTarget: `₹${targetIncome.toLocaleString('en-IN')}`,
        financialProgressPercent: progressPercent,
        monthlyExpenses: `₹${expensesVal.toLocaleString('en-IN')}`,
        pendingDuesFlats: pendingDuesCount || 0,
        totalInflow: `₹${incomeVal.toLocaleString('en-IN')}`,
        totalOutflow: `₹${expensesVal.toLocaleString('en-IN')}`,
        totalResidents,
        pendingComplaintsCount,
        baseBalance,
      },
      pendingApprovals: {
        count: society.pendingApprovalsCount || 0,
        item: society.pendingApprovalItem || { title: 'No pending approvals', amount: '₹0' },
      },
      attentionItems: society.attentionItems || [],
      recentActivities: society.recentActivities || [],
      upcomingEvents,
      recentTransactions,
    };
  }

  async updateSocietyDetails(societyId, updateData) {
    let society = null;
    if (societyId && require('mongoose').Types.ObjectId.isValid(societyId)) {
      society = await Society.findByIdAndUpdate(societyId, updateData, {
        new: true,
        runValidators: true,
      });
    }
    if (!society) {
      society = await Society.findOneAndUpdate({}, updateData, {
        new: true,
        runValidators: true,
      });
    }
    if (!society) {
      throw ApiError.notFound('Society not found');
    }
    return society;
  }
}

module.exports = new SocietyService();
