const express = require('express');
const { body } = require('express-validator');
const financeController = require('../controllers/financeController');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/summary', financeController.getFinanceSummary);
router.get('/transactions', financeController.getTransactions);

router.post(
  '/transactions',
  [
    body('title').notEmpty().withMessage('Transaction title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isNumeric().withMessage('Amount must be a numeric value'),
  ],
  validate,
  financeController.createTransaction
);

module.exports = router;
