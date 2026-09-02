const Transaction = require('../models/Transaction');
const Society = require('../models/Society');
const Resident = require('../models/Resident');
const ApiError = require('../utils/apiError');

class FinanceService {
  async getFinanceSummary(societyId) {
    const defaultSociety = societyId
      ? await Society.findById(societyId)
      : await Society.findOne();

    if (!defaultSociety) {
      throw ApiError.notFound('Society not found');
    }

    const pendingDues = await Resident.find({
      paymentStatus: 'Pending',
    });

    const majorExpenses = [
      { category: 'Security', amount: '₹90,000', percentage: 67, color: '#3f6651' },
      { category: 'Cleaning', amount: '₹25,000', percentage: 18, color: '#31666b' },
      { category: 'Electricity', amount: '₹18,500', percentage: 15, color: '#48607d' },
    ];

    return {
      currentBalance: `₹${defaultSociety.currentBalance.toLocaleString('en-IN')}`,
      detailedBalance: `₹${defaultSociety.detailedBalance.toLocaleString('en-IN')}`,
      balanceTrend: defaultSociety.balanceTrend,
      monthlyIncome: `₹${defaultSociety.monthlyIncome.toLocaleString('en-IN')}`,
      monthlyIncomeTarget: `₹${defaultSociety.monthlyIncomeTarget.toLocaleString('en-IN')}`,
      financialProgressPercent: defaultSociety.financialProgressPercent,
      monthlyExpenses: `₹${defaultSociety.monthlyExpenses.toLocaleString('en-IN')}`,
      totalInflow: `₹${defaultSociety.totalInflow.toLocaleString('en-IN')}`,
      totalOutflow: `₹${defaultSociety.totalOutflow.toLocaleString('en-IN')}`,
      pendingDuesCount: pendingDues.length,
      pendingDues,
      majorExpenses,
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
    const { title, category, amount, isCredit, date } = data;

    const defaultSociety = await Society.findOne();

    const transaction = await Transaction.create({
      society: defaultSociety ? defaultSociety._id : undefined,
      title,
      category,
      amount: Number(amount),
      isCredit: Boolean(isCredit),
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });

    // Update society balance accordingly
    if (defaultSociety) {
      if (isCredit) {
        defaultSociety.currentBalance += Number(amount);
        defaultSociety.totalInflow += Number(amount);
      } else {
        defaultSociety.currentBalance -= Number(amount);
        defaultSociety.totalOutflow += Number(amount);
      }
      await defaultSociety.save();
    }

    return transaction;
  }
}

module.exports = new FinanceService();
