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

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
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

  const avatarUrl = `/public/uploads/avatars/${req.file.filename}`;
  return ApiResponse.success(res, 'Avatar image uploaded successfully', { avatarUrl });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return ApiResponse.success(res, result.message, result);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  return ApiResponse.success(res, result.message, result);
});
