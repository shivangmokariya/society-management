const operationService = require('../services/operationService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Complaints
exports.getComplaints = asyncHandler(async (req, res) => {
  const { category, status, search, societyId } = req.query;
  const targetSociety = societyId || (req.user && req.user.societyId);
  const complaints = await operationService.getComplaints({ category, status, search, societyId: targetSociety });
  return ApiResponse.success(res, 'Complaints list fetched successfully', complaints);
});

exports.createComplaint = asyncHandler(async (req, res) => {
  const complaint = await operationService.createComplaint(req.body);
  return ApiResponse.created(res, 'Complaint filed successfully', complaint);
});

exports.updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const complaint = await operationService.updateComplaintStatus(req.params.id, status);
  return ApiResponse.success(res, 'Complaint status updated successfully', complaint);
});

// Assets
exports.getAssets = asyncHandler(async (req, res) => {
  const { societyId } = req.query;
  const assets = await operationService.getAssets(societyId);
  return ApiResponse.success(res, 'Assets list fetched successfully', assets);
});

exports.createAsset = asyncHandler(async (req, res) => {
  const asset = await operationService.createAsset(req.body);
  return ApiResponse.created(res, 'Asset added successfully', asset);
});

exports.updateAsset = asyncHandler(async (req, res) => {
  const asset = await operationService.updateAsset(req.params.id, req.body);
  return ApiResponse.success(res, 'Asset updated successfully', asset);
});

// Water Tanks
exports.getWaterTanks = asyncHandler(async (req, res) => {
  const { societyId } = req.query;
  const data = await operationService.getWaterTanks(societyId);
  return ApiResponse.success(res, 'Water tank metrics fetched successfully', data);
});

exports.getWaterTankers = asyncHandler(async (req, res) => {
  const { societyId } = req.query;
  const tankers = await operationService.getWaterTankers(societyId);
  return ApiResponse.success(res, 'Water tanker log fetched successfully', tankers);
});

exports.updateWaterTank = asyncHandler(async (req, res) => {
  const tank = await operationService.updateWaterTank(req.params.id, req.body);
  return ApiResponse.success(res, 'Water tank updated successfully', tank);
});

exports.recordTanker = asyncHandler(async (req, res) => {
  const log = await operationService.recordTanker(req.body);
  return ApiResponse.created(res, 'Water tanker log recorded successfully', log);
});
