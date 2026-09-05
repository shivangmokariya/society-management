const Transaction = require('../models/Transaction');
const Society = require('../models/Society');
const Resident = require('../models/Resident');
const ApiError = require('../utils/apiError');

class FinanceService {
  async getFinanceSummary(societyId) {
    const societyService = require('./societyService');
    const society = await societyService.getSocietyDetails(societyId);
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

    // 1. Calculate Inflow & Outflow from DB Transactions
    const transactions = await Transaction.find(societyQuery).sort({ createdAt: -1 });

    let creditSum = 0;
    let debitSum = 0;
    const categoryExpensesMap = {};

    transactions.forEach((t) => {
      if (t.isCredit) {
        creditSum += t.amount || 0;
      } else {
        debitSum += t.amount || 0;
        const cat = t.category || 'Other';
        categoryExpensesMap[cat] = (categoryExpensesMap[cat] || 0) + (t.amount || 0);
      }
    });

    const baseBalance = society.currentBalance || 0;
    const currentBalVal = baseBalance + creditSum - debitSum;

    // Dynamic Major Expenses from DB
    const categoryColors = {
      Security: '#3f6651',
      Cleaning: '#31666b',
      Electricity: '#48607d',
      Plumbing: '#5c6b73',
      Maintenance: '#708090',
      Other: '#8d99ae',
    };

    const majorExpenses = Object.keys(categoryExpensesMap).map((cat) => {
      const amt = categoryExpensesMap[cat];
      const percentage = debitSum > 0 ? Math.round((amt / debitSum) * 100) : 0;
      return {
        category: cat,
        amount: `₹${amt.toLocaleString('en-IN')}`,
        percentage,
        color: categoryColors[cat] || '#3f6651',
      };
    });

    // Pending Dues Count
    const pendingDues = await Resident.find({
      ...societyQuery,
      paymentStatus: { $in: ['Pending', 'Overdue'] },
    });

    const targetIncome = society.monthlyIncomeTarget || 300000;
    const progressPercent = targetIncome > 0 ? Math.min(100, Math.round((creditSum / targetIncome) * 100)) : 0;

    return {
      currentBalance: `₹${currentBalVal.toLocaleString('en-IN')}`,
      detailedBalance: `₹${currentBalVal.toLocaleString('en-IN')}`,
      balanceTrend: society.balanceTrend || '0% vs last month',
      monthlyIncome: `₹${creditSum.toLocaleString('en-IN')}`,
      monthlyIncomeTarget: `₹${targetIncome.toLocaleString('en-IN')}`,
      financialProgressPercent: progressPercent,
      monthlyExpenses: `₹${debitSum.toLocaleString('en-IN')}`,
      totalInflow: `₹${creditSum.toLocaleString('en-IN')}`,
      totalOutflow: `₹${debitSum.toLocaleString('en-IN')}`,
      pendingDuesCount: pendingDues.length,
      pendingDues,
      majorExpenses,
      baseBalance,
    };
  }

  async getTransactions({ category, isCredit, search }) {
    const filter = {};
    if (category) filter.category = category;
    if (isCredit !== undefined) filter.isCredit = isCredit === 'true';
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    return await Transaction.find(filter).sort({ createdAt: -1 });
  }

  async createTransaction(data) {
    const { title, category, amount, isCredit, date, societyId } = data;

    const defaultSociety = societyId ? await Society.findById(societyId) : await Society.findOne();

    const transaction = await Transaction.create({
      society: defaultSociety ? defaultSociety._id : undefined,
      title,
      category,
      amount: Number(amount),
      isCredit: Boolean(isCredit),
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });

    return transaction;
  }
}

module.exports = new FinanceService();
