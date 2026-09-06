const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.registerSecretary = asyncHandler(async (req, res) => {
  const result = await authService.registerSecretary(req.body);
  return ApiResponse.created(
    res,
    'Secretary registration request submitted successfully. Awaiting approval.',
    result
  );
});

exports.getSecretaryRegistrations = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const result = await authService.getSecretaryRegistrations(status);
  return ApiResponse.success(res, 'Registrations retrieved successfully', result);
});

exports.approveSecretary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { customPassword } = req.body;
  const result = await authService.approveSecretary(id, customPassword);
  return ApiResponse.success(res, 'Secretary registration approved successfully', result);
});

exports.rejectSecretary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await authService.rejectSecretary(id);
  return ApiResponse.success(res, 'Secretary registration rejected successfully', result);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const result = await authService.login(email, password, rememberMe);
  return ApiResponse.success(res, 'Login successful', result);
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  return ApiResponse.success(res, 'User profile fetched successfully', user);
});

exports.updateMe = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUserProfile(req.user.id, req.body);
  return ApiResponse.success(res, 'User profile updated successfully', updatedUser);
});

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
  }

  const avatarUrl = req.file.path || req.file.secure_url || `/public/uploads/avatars/${req.file.filename}`;
  return ApiResponse.success(res, 'Avatar image uploaded successfully', { avatarUrl });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return ApiResponse.success(res, result.message, result);
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOtp(email, otp);
  return ApiResponse.success(res, result.message, result);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  return ApiResponse.success(res, result.message, result);
});
