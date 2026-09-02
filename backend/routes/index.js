const express = require('express');
const authRoutes = require('./authRoutes');
const societyRoutes = require('./societyRoutes');
const residentRoutes = require('./residentRoutes');
const financeRoutes = require('./financeRoutes');
const operationRoutes = require('./operationRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/society', societyRoutes);
router.use('/residents', residentRoutes);
router.use('/finance', financeRoutes);
router.use('/operations', operationRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
