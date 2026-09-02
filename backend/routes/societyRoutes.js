const express = require('express');
const societyController = require('../controllers/societyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/details', societyController.getSocietyDetails);
router.get('/dashboard', societyController.getDashboardData);
router.put('/details/:id', protect, societyController.updateSocietyDetails);

module.exports = router;
