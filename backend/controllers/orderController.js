const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

const DELIVERY_FEE = 30;

const placeOrder = async (req, res) => {
  const { deliveryAddress, paymentMethod, couponCode } = req.body;

  if (!deliveryAddress) {
    return res.status(400).json({ message: 'Delivery address is required' });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.foodItem');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  const items = cart.items
    .filter((i) => i.foodItem)
    .map((i) => ({
      foodItem: i.foodItem._id,
      name: i.foodItem.name,
      price: i.foodItem.price,
      quantity: i.quantity
    }));

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  let appliedCode = '';
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }
    if (itemsTotal < coupon.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` });
    }
    discount = Math.round((itemsTotal * coupon.discountPercent) / 100);
    appliedCode = coupon.code;
  }

  const totalAmount = Math.max(0, itemsTotal + DELIVERY_FEE - discount);

  const order = await Order.create({
    user: req.user._id,
    items,
    itemsTotal,
    deliveryFee: DELIVERY_FEE,
    discount,
    totalAmount,
    couponCode: appliedCode,
    deliveryAddress,
    paymentMethod: paymentMethod || 'cod'
  });

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  res.json(order);
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  if (order.status !== 'pending') {
    return res.status(400).json({ message: 'Only pending orders can be cancelled' });
  }

  order.status = 'cancelled';
  await order.save();
  res.json(order);
};

const getAllOrders = async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const orders = await Order.find(query).populate('user', 'name email phone').sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  await order.save();
  res.json(order);
};

module.exports = { placeOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus };
