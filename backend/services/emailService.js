const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    const rawPass = process.env.SMTP_PASS || 'eaik qtkn ibhf bfyp';
    const cleanPass = rawPass.replace(/\s+/g, '');
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'shivangmokariya.dev@gmail.com',
        pass: cleanPass,
      },
    });
  }

  // Common Header & Footer Email Template Wrapper
  getHtmlLayout(title, content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #faf9f4;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1b1c19;
            -webkit-font-smoothing: antialiased;
          }
          .email-wrapper {
            width: 100%;
            background-color: #faf9f4;
            padding: 40px 15px;
            box-sizing: border-box;
          }
          .email-card {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 20px;
            border: 1px solid #EAE9E1;
            box-shadow: 0 8px 24px rgba(51, 58, 61, 0.04);
            overflow: hidden;
          }
          .header-banner {
            background-color: #3f6651;
            padding: 32px 28px;
            text-align: center;
          }
          .brand-name {
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .brand-tag {
            color: #c1edd2;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
            display: block;
          }
          .body-content {
            padding: 36px 32px;
          }
          .heading {
            font-size: 20px;
            font-weight: 700;
            color: #1b1c19;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .text {
            font-size: 15px;
            line-height: 1.6;
            color: #414843;
            margin-bottom: 20px;
          }
          .creds-box {
            background-color: #faf9f4;
            border: 1px dashed #7da68e;
            border-radius: 14px;
            padding: 20px;
            margin: 24px 0;
          }
          .creds-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .creds-row:last-child {
            margin-bottom: 0;
          }
          .creds-label {
            color: #717973;
            font-weight: 600;
          }
          .creds-value {
            color: #1b1c19;
            font-weight: 700;
            font-family: monospace, sans-serif;
          }
          .badge-pending {
            display: inline-block;
            background-color: #FFF4E5;
            color: #935500;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
          }
          .badge-approved {
            display: inline-block;
            background-color: #E8F3ED;
            color: #284E3B;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
          }
          .btn-primary {
            display: inline-block;
            background-color: #3f6651;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 15px;
            margin-top: 10px;
            box-shadow: 0 4px 14px rgba(63, 102, 81, 0.25);
          }
          .footer {
            background-color: #f5f4ef;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #717973;
            border-top: 1px solid #EAE9E1;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-card">
            <div class="header-banner">
              <h1 class="brand-name">CALM</h1>
              <span class="brand-tag">Society Management Portal</span>
            </div>
            <div class="body-content">
              ${content}
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} CALM Society Management. All rights reserved.
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 1. Send Confirmation Email when Secretary submits registration
  async sendRegistrationReceivedEmail({ email, fullName, societyName }, isResend = false) {
    const regType = isResend ? 'Resend/Update Request' : 'First-Time Registration';
    const subject = isResend 
      ? `Updated Secretary Access Request - ${societyName}`
      : `Secretary Access Request Received - ${societyName}`;

    logger.info(`📧 [EMAIL INITIATED] Preparing confirmation email to: ${email} | Society: ${societyName} | Type: ${regType}`);

    const content = `
      <div style="text-align: right; margin-bottom: 12px;">
        <span class="badge-pending">Status: Under Review</span>
      </div>
      <h2 class="heading">Hello ${fullName},</h2>
      <p class="text">
        Thank you for submitting your secretary registration request for <strong>${societyName}</strong> on the <strong>CALM Society Management Portal</strong>.
      </p>
      <p class="text">
        We have received your application details. Our system administrator is reviewing your registration request. Once approved, you will receive an email confirmation containing your account login credentials.
      </p>
      <div class="creds-box">
        <div class="creds-row">
          <span class="creds-label">Society Name:</span>
          <span class="creds-value">${societyName}</span>
        </div>
        <div class="creds-row">
          <span class="creds-label">Registered Email:</span>
          <span class="creds-value">${email}</span>
        </div>
      </div>
      <p class="text">
        If you have any urgent questions, please feel free to reply directly to this email.
      </p>
    `;

    const html = this.getHtmlLayout(isResend ? 'Registration Updated' : 'Registration Received', content);

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'CALM Admin System'}" <${process.env.FROM_EMAIL || 'shivangmokariya.dev@gmail.com'}>`,
        to: email,
        bcc: 'shivangmokariya@gmail.com',
        subject,
        html,
      });
      logger.info(`✅ [EMAIL SUCCESS] Confirmation email delivered | Recipient: ${email} | Type: ${regType} | MessageId: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`❌ [EMAIL FAILED] Failed to send confirmation email | Recipient: ${email} | Type: ${regType} | Error: ${error.message}`, error);
      return null;
    }
  }

  // 2. Send Approval Email when Admin approves Secretary request
  async sendSecretaryApprovedEmail({ email, fullName, societyName }, password) {
    const subject = `🎉 Congratulations! Your Secretary Access is Approved - ${societyName}`;
    const content = `
      <div style="text-align: right; margin-bottom: 12px;">
        <span class="badge-approved">Status: Access Approved</span>
      </div>
      <h2 class="heading">Welcome Aboard, ${fullName}!</h2>
      <p class="text">
        Great news! Your secretary access request for <strong>${societyName}</strong> has been officially <strong>approved</strong> by the administrator.
      </p>
      <p class="text">
        You can now log in to the <strong>CALM Mobile App</strong> to access your society dashboard, manage residents, handle complaints, track finances, and streamline operations.
      </p>
      <div class="creds-box">
        <div style="font-weight: 700; color: #3f6651; margin-bottom: 12px; font-size: 14px;">Your Mobile App Login Credentials:</div>
        <div class="creds-row">
          <span class="creds-label">Email:</span>
          <span class="creds-value">${email}</span>
        </div>
        <div class="creds-row">
          <span class="creds-label">Temporary Password:</span>
          <span class="creds-value" style="color: #3f6651; font-size: 16px;">${password}</span>
        </div>
      </div>
      <p class="text" style="font-size: 13px; color: #717973; text-align: center; margin-top: 20px;">
        Please open your <strong>CALM Mobile App</strong> to sign in with these credentials.
      </p>
    `;

    const html = this.getHtmlLayout('Secretary Access Approved', content);

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'CALM Admin System'}" <${process.env.FROM_EMAIL || 'shivangmokariya@gmail.com'}>`,
        to: email,
        subject,
        html,
      });
      logger.info(`✉️ Approval Email sent successfully to: ${email} | MessageId: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`❌ Error sending approval email to ${email}: ${error.message}`, error);
      return null;
    }
  }

  // 3. Send Password Reset OTP Email
  async sendOtpEmail({ email, fullName, otp }) {
    const subject = `🔒 ${otp} is your CALM Password Reset Code`;
    const content = `
      <div style="text-align: center; margin-bottom: 16px;">
        <span class="badge-pending" style="background-color: #EBF5FF; color: #1E429F;">Action Required: Verification Code</span>
      </div>
      <h2 class="heading">Hello ${fullName || 'User'},</h2>
      <p class="text">
        We received a request to reset your password for your <strong>CALM Society Management</strong> account.
      </p>
      <p class="text">
        Use the following 6-digit Verification Code (OTP) to proceed with resetting your password:
      </p>
      <div style="background-color: #f4fbf7; border: 2px dashed #3f6651; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #3f6651; font-family: monospace;">${otp}</span>
      </div>
      <p class="text" style="font-size: 13px; color: #717973; text-align: center;">
        This code is valid for <strong>10 minutes</strong>. Do not share this OTP code with anyone.
      </p>
      <p class="text" style="font-size: 13px; color: #999; text-align: center; margin-top: 16px;">
        If you did not request a password reset, please ignore this email or contact support if you have concerns.
      </p>
    `;

    const html = this.getHtmlLayout('Password Reset Code', content);

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'CALM Security'}" <${process.env.FROM_EMAIL || 'shivangmokariya.dev@gmail.com'}>`,
        to: email,
        subject,
        html,
      });
      logger.info(`✅ [OTP EMAIL SUCCESS] OTP sent to: ${email} | MessageId: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`❌ [OTP EMAIL FAILED] Failed to send OTP to ${email}: ${error.message}`, error);
      return null;
    }
  }
}

module.exports = new EmailService();
