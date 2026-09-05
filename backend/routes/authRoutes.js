const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post(
  '/register-secretary',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('societyName').notEmpty().withMessage('Society name is required'),
    body('email').isEmail().withMessage('Valid email address is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
  ],
  validate,
  authController.registerSecretary
);

router.get('/secretary-registrations', authController.getSecretaryRegistrations);
router.post('/approve-secretary/:id', authController.approveSecretary);
router.post('/reject-secretary/:id', authController.rejectSecretary);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.get('/me', protect, authController.getMe);
router.put('/me', protect, authController.updateMe);
router.post('/upload-avatar', protect, upload.single('avatar'), authController.uploadAvatar);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email address is required')],
  validate,
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  [body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  validate,
  authController.resetPassword
);

module.exports = router;
