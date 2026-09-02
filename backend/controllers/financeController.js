const financeService = require('../services/financeService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getFinanceSummary = asyncHandler(async (req, res) => {
  const societyId = req.query.societyId || (req.user && req.user.societyId);
  const summary = await financeService.getFinanceSummary(societyId);
  return ApiResponse.success(res, 'Financial summary fetched successfully', summary);
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const { category, isCredit, search } = req.query;
  const transactions = await financeService.getTransactions({ category, isCredit, search });
  return ApiResponse.success(res, 'Transactions fetched successfully', transactions);
});

exports.createTransaction = asyncHandler(async (req, res) => {
  const transaction = await financeService.createTransaction(req.body);
  return ApiResponse.created(res, 'Transaction created successfully', transaction);
});
