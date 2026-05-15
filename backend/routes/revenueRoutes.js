const express = require('express');
const router = express.Router();
const { getRevenueReport } = require('../controllers/revenueController');

// Route GET /api/revenue/report
router.get('/report', getRevenueReport);

module.exports = router;
