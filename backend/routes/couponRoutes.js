const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, toggleCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect, requireRole('admin'));

router.route('/').get(getCoupons).post(createCoupon);
router.put('/:id/toggle', toggleCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;
