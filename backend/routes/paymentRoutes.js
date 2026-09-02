const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.get('/resident/:residentId', paymentController.getResidentPayments);
router.post('/resident/:residentId', paymentController.addResidentPayment);

module.exports = router;
