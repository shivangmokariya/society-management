const User = require('../models/User');
const SecretaryRegistration = require('../models/SecretaryRegistration');
const Society = require('../models/Society');
const ApiError = require('../utils/apiError');
const generateToken = require('../utils/generateToken');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class AuthService {
  async registerSecretary(data) {
    const { fullName, societyName, email, phone } = data;
    const normalizedEmail = (email || '').toLowerCase().trim();

    let registration = await SecretaryRegistration.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
    });

    let isResend = false;

    if (registration) {
      if (registration.status === 'Approved') {
        logger.warn(`⚠️ [REGISTRATION BLOCKED] Email is already approved: ${normalizedEmail}`);
        throw ApiError.badRequest('This email is already registered and approved as a Secretary. Please log in.');
      }
      isResend = true;
      logger.info(`🔄 [RESEND REGISTRATION] Re-submitting request for ${fullName} (${normalizedEmail}) - Society: ${societyName}`);
      registration.fullName = fullName;
      registration.societyName = societyName;
      registration.phone = phone;
      registration.status = 'Pending';
      await registration.save();
    } else {
      isResend = false;
      logger.info(`🆕 [NEW REGISTRATION] Processing new secretary application for ${fullName} (${normalizedEmail}) - Society: ${societyName}`);
      registration = await SecretaryRegistration.create({
        fullName,
        societyName,
        email: normalizedEmail,
        phone,
        status: 'Pending',
      });
    }

    // Send confirmation email
    try {
      const emailInfo = await emailService.sendRegistrationReceivedEmail(registration, isResend);
      if (emailInfo) {
        logger.info(`✨ [REGISTRATION COMPLETED] Request processed & confirmation email sent to ${normalizedEmail}`);
      } else {
        logger.error(`⚠️ [REGISTRATION WARNING] Application saved in DB but confirmation email dispatch failed for ${normalizedEmail}`);
      }
    } catch (err) {
      logger.error(`❌ [REGISTRATION ERROR] Error during email dispatch for ${normalizedEmail}: ${err.message}`, err);
    }

    return registration;
  }

  async getSecretaryRegistrations(status) {
    const query = status ? { status } : {};
    return await SecretaryRegistration.find(query).sort({ createdAt: -1 });
  }

  async approveSecretary(registrationId, customPassword) {
    const registration = await SecretaryRegistration.findById(registrationId);
    if (!registration) {
      throw ApiError.notFound('Registration request not found');
    }

    const firstName = registration.fullName.trim().split(' ')[0];
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const phoneDigits = registration.phone.replace(/\D/g, '');
    const phoneSuffix = phoneDigits.slice(-4) || '1234';

    const generatedPassword = customPassword || `${capitalizedFirstName}@${phoneSuffix}`;

    // Create or find Society
    let society = await Society.findOne({ name: registration.societyName });
    if (!society) {
      society = await Society.create({
        name: registration.societyName,
        secretaryName: firstName,
        secretaryFullName: registration.fullName,
        secretaryRole: 'Society Secretary',
        logoUrl: '/public/assets/logos/society_logo.jpg',
        loginCardLogoUrl: '/public/assets/logos/login_card_logo.jpg',
        profileAvatarUrl: '/public/assets/avatars/avatar_1.jpg',
      });
    }

    // Create or update User
    let user = await User.findOne({ email: registration.email.toLowerCase().trim() });
    if (!user) {
      user = new User({
        fullName: registration.fullName,
        email: registration.email.toLowerCase().trim(),
        phone: registration.phone,
        password: generatedPassword,
        role: 'Secretary',
        society: society._id,
        isVerified: true,
        avatarUrl: '/public/assets/avatars/avatar_1.jpg',
      });
      await user.save();
    } else {
      user.society = society._id;
      user.role = 'Secretary';
      user.isVerified = true;
      user.password = generatedPassword;
      await user.save();
    }

    registration.status = 'Approved';
    await registration.save();

    // Send approval confirmation email with credentials
    emailService.sendSecretaryApprovedEmail(registration, generatedPassword).catch((err) => {
      console.error('Failed to send approval email:', err);
    });

    return {
      registration,
      society,
      user,
      generatedPassword,
    };
  }

  async rejectSecretary(registrationId) {
    const registration = await SecretaryRegistration.findById(registrationId);
    if (!registration) {
      throw ApiError.notFound('Registration request not found');
    }

    registration.status = 'Rejected';
    await registration.save();

    return {
      registration,
    };
  }

  async login(email, password, rememberMe = false) {
    const user = await User.findOne({ email }).select('+password').populate('society');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const expiresInDays = rememberMe ? 30 : 7;
    const token = generateToken(user, `${expiresInDays}d`);
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
      expiresInDays,
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
