const User = require('../models/User');
const SecretaryRegistration = require('../models/SecretaryRegistration');
const Society = require('../models/Society');
const ApiError = require('../utils/apiError');
const generateToken = require('../utils/generateToken');

class AuthService {
  async registerSecretary(data) {
    const { fullName, societyName, email, phone } = data;

    const existingReq = await SecretaryRegistration.findOne({ email });
    if (existingReq) {
      throw ApiError.badRequest('A registration request with this email already exists');
    }

    const registration = await SecretaryRegistration.create({
      fullName,
      societyName,
      email,
      phone,
      status: 'Pending',
    });

    return registration;
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password').populate('society');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user);
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).populate('society');
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async updateUserProfile(userId, updateData) {
    const allowedUpdates = {};
    if (updateData.fullName) allowedUpdates.fullName = updateData.fullName;
    if (updateData.phone) allowedUpdates.phone = updateData.phone;
    if (updateData.avatarUrl !== undefined) allowedUpdates.avatarUrl = updateData.avatarUrl;

    const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
      runValidators: true,
    }).populate('society');

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Also update secretary name in society if user is Secretary
    if (user.society && user.fullName) {
      await Society.findByIdAndUpdate(user.society._id, {
        secretaryFullName: user.fullName,
        secretaryName: user.fullName.split(' ')[0],
      });
    }

    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw ApiError.notFound('No account found with this email address. Please check your email.');
    }

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour expiry
    await user.save({ validateBeforeSave: false });

    return {
      message: 'Password reset link sent to your email address.',
      resetToken,
      email: user.email,
    };
  }

  async resetPassword(token, newPassword) {
    if (!token) {
      throw ApiError.badRequest('Invalid or missing password reset token.');
    }

    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired password reset token. Please request a new link.');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return {
      message: 'Password has been reset successfully. You can now log in.',
    };
  }
}

module.exports = new AuthService();
