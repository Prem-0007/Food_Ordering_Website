const Coupon = require('../models/Coupon');

const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
};

const createCoupon = async (req, res) => {
  const { code, discountPercent, minOrderAmount } = req.body;
  if (!code || !discountPercent) {
    return res.status(400).json({ message: 'Code and discount percent are required' });
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountPercent,
    minOrderAmount: minOrderAmount || 0
  });
  res.status(201).json(coupon);
};

const toggleCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

  coupon.isActive = !coupon.isActive;
  await coupon.save();
  res.json(coupon);
};

const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

  await coupon.deleteOne();
  res.json({ message: 'Coupon removed' });
};

module.exports = { getCoupons, createCoupon, toggleCoupon, deleteCoupon };
