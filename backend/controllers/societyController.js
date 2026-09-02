const societyService = require('../services/societyService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getSocietyDetails = asyncHandler(async (req, res) => {
  const societyId = req.query.societyId || (req.user && req.user.societyId);
  const society = await societyService.getSocietyDetails(societyId);
  return ApiResponse.success(res, 'Society details fetched successfully', society);
});

exports.getDashboardData = asyncHandler(async (req, res) => {
  const societyId = req.query.societyId || (req.user && req.user.societyId);
  const dashboardData = await societyService.getDashboardData(societyId);
  return ApiResponse.success(res, 'Dashboard data fetched successfully', dashboardData);
});

exports.updateSocietyDetails = asyncHandler(async (req, res) => {
  const societyId = req.params.id || (req.user && req.user.societyId);
  const updatedSociety = await societyService.updateSocietyDetails(societyId, req.body);
  return ApiResponse.success(res, 'Society profile updated successfully', updatedSociety);
});
