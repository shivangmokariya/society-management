const express = require('express');
const { body } = require('express-validator');
const operationController = require('../controllers/operationController');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

// Complaints
router.get('/complaints', operationController.getComplaints);
router.post(
  '/complaints',
  [
    body('title').notEmpty().withMessage('Complaint title is required'),
    body('flat').notEmpty().withMessage('Flat number is required'),
  ],
  validate,
  operationController.createComplaint
);
router.patch('/complaints/:id/status', operationController.updateComplaintStatus);

// Assets
router.get('/assets', operationController.getAssets);
router.post(
  '/assets',
  [body('name').notEmpty().withMessage('Asset name is required')],
  validate,
  operationController.createAsset
);
router.put('/assets/:id', operationController.updateAsset);

// Water Tanks
router.get('/water-tanks', operationController.getWaterTanks);
router.put('/water-tanks/:id', operationController.updateWaterTank);
router.post('/record-tanker', operationController.recordTanker);

module.exports = router;
