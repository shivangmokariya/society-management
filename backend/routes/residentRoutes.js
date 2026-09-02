const express = require('express');
const { body } = require('express-validator');
const residentController = require('../controllers/residentController');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', residentController.getResidents);
router.get('/:id', residentController.getResidentById);

router.post(
  '/owner',
  [
    body('fullName').notEmpty().withMessage('Owner full name is required'),
    body('flatNumber').notEmpty().withMessage('Flat number is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
  ],
  validate,
  residentController.addOwner
);

router.post(
  '/tenant',
  [
    body('fullName').notEmpty().withMessage('Tenant full name is required'),
    body('flatAssignment').notEmpty().withMessage('Flat assignment is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
  ],
  validate,
  residentController.addTenant
);

router.put('/:id', residentController.updateResident);
router.delete('/:id', residentController.deleteResident);

module.exports = router;
