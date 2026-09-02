const residentService = require('../services/residentService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.getResidents = asyncHandler(async (req, res) => {
  const { search, block, status, paymentStatus } = req.query;
  const societyId = req.query.societyId || (req.user && req.user.societyId);

  const residents = await residentService.getResidents({
    societyId,
    search,
    block,
    status,
    paymentStatus,
  });

  return ApiResponse.success(res, 'Residents list fetched successfully', residents);
});

exports.getResidentById = asyncHandler(async (req, res) => {
  const resident = await residentService.getResidentById(req.params.id);
  return ApiResponse.success(res, 'Resident details fetched successfully', resident);
});

exports.addOwner = asyncHandler(async (req, res) => {
  const resident = await residentService.addOwner(req.body);
  return ApiResponse.created(res, 'Owner registered successfully', resident);
});

exports.addTenant = asyncHandler(async (req, res) => {
  const resident = await residentService.addTenant(req.body);
  return ApiResponse.created(res, 'Tenant registered successfully', resident);
});

exports.updateResident = asyncHandler(async (req, res) => {
  const resident = await residentService.updateResident(req.params.id, req.body);
  return ApiResponse.success(res, 'Resident details updated successfully', resident);
});

exports.deleteResident = asyncHandler(async (req, res) => {
  await residentService.deleteResident(req.params.id);
  return ApiResponse.success(res, 'Resident entry deleted successfully');
});
