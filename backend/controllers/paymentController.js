const MaintenancePayment = require('../models/MaintenancePayment');
const Resident = require('../models/Resident');
const Society = require('../models/Society');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

exports.getResidentPayments = asyncHandler(async (req, res) => {
  const { residentId } = req.params;

  let filter = {};
  if (residentId && residentId !== 'all') {
    filter = { resident: residentId };
  } else if (req.query.flat) {
    filter = { flat: req.query.flat };
  }

  const payments = await MaintenancePayment.find(filter).sort({ createdAt: -1 });
  return ApiResponse.success(res, 'Maintenance payments fetched successfully', payments);
});

exports.addResidentPayment = asyncHandler(async (req, res) => {
  const { residentId } = req.params;
  const { amount, paymentDate, dueDate, monthPeriod, paymentMethod, payerName, payerRole } = req.body;

  const resident = await Resident.findById(residentId);
  if (!resident) {
    throw ApiError.notFound('Resident not found');
  }

  const defaultSociety = await Society.findOne();
  const societyId = resident.society || (defaultSociety ? defaultSociety._id : null);

  // Compute status if not explicitly passed
  let status = req.body.status;
  if (!status && paymentDate && dueDate) {
    const pDate = new Date(paymentDate);
    const dDate = new Date(dueDate);
    if (!isNaN(pDate.getTime()) && !isNaN(dDate.getTime())) {
      status = pDate > dDate ? 'Late' : 'On Time';
    } else {
      status = 'On Time';
    }
  }

  const payment = await MaintenancePayment.create({
    society: societyId,
    resident: resident._id,
    flat: resident.flat,
    payerName: payerName || resident.residentName || resident.ownerName,
    payerRole: payerRole || (resident.isSelfOwner ? 'Owner' : 'Tenant'),
    amount: Number(amount) || 2500,
    paymentDate: paymentDate || new Date().toISOString().split('T')[0],
    dueDate: dueDate || '2026-08-05',
    status: status || 'On Time',
    monthPeriod: monthPeriod || 'August 2026',
    paymentMethod: paymentMethod || 'UPI',
  });

  // Update resident payment status if needed
  resident.paymentStatus = 'Paid';
  resident.pendingAmount = '';
  await resident.save();

  return ApiResponse.created(res, 'Maintenance payment recorded successfully', payment);
});
