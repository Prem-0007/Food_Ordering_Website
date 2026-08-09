const express = require('express');
const router = express.Router();
const { getAdminDashboard, getReports } = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/admin', protect, requireRole('admin'), getAdminDashboard);
router.get('/reports', protect, requireRole('admin'), getReports);

module.exports = router;
