const Society = require('../models/Society');
const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');
const Event = require('../models/Event');
const Resident = require('../models/Resident');
const ApiError = require('../utils/apiError');

class SocietyService {
  async getSocietyDetails(societyId) {
    let society = null;
    if (societyId) {
      society = await Society.findById(societyId);
    } else {
      society = await Society.findOne();
    }

    if (!society) {
      throw ApiError.notFound('Society data not found');
    }
    return society;
  }

  async getDashboardData(societyId) {
    const society = await this.getSocietyDetails(societyId);
    const targetSocietyId = society._id;

    // Fetch dynamic aggregated statistics
    const recentTransactions = await Transaction.find({ society: targetSocietyId })
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingComplaintsCount = await Complaint.countDocuments({
      society: targetSocietyId,
      status: { $ne: 'Resolved' },
    });

    const upcomingEvents = await Event.find({ society: targetSocietyId }).limit(5);

    const totalResidents = await Resident.countDocuments({ society: targetSocietyId });
    const pendingDuesCount = await Resident.countDocuments({
      society: targetSocietyId,
      paymentStatus: 'Pending',
    });

    return {
      society,
      dashboardStats: {
        currentBalance: `₹${society.currentBalance.toLocaleString('en-IN')}`,
        detailedBalance: `₹${society.detailedBalance.toLocaleString('en-IN')}`,
        balanceTrend: society.balanceTrend,
        monthlyIncome: `₹${society.monthlyIncome.toLocaleString('en-IN')}`,
        monthlyIncomeTarget: `₹${society.monthlyIncomeTarget.toLocaleString('en-IN')}`,
        financialProgressPercent: society.financialProgressPercent,
        monthlyExpenses: `₹${society.monthlyExpenses.toLocaleString('en-IN')}`,
        pendingDuesFlats: pendingDuesCount || society.pendingDuesFlats,
        totalInflow: `₹${society.totalInflow.toLocaleString('en-IN')}`,
        totalOutflow: `₹${society.totalOutflow.toLocaleString('en-IN')}`,
        totalResidents,
        pendingComplaintsCount,
      },
      pendingApprovals: {
        count: society.pendingApprovalsCount,
        item: society.pendingApprovalItem,
      },
      attentionItems: society.attentionItems,
      recentActivities: society.recentActivities,
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
