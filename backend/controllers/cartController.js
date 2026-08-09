const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.foodItem');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  cart.items = cart.items.filter((i) => i.foodItem);
  res.json(cart);
};

const addToCart = async (req, res) => {
  const { foodItemId, quantity } = req.body;
  if (!foodItemId) return res.status(400).json({ message: 'foodItemId is required' });

  const foodItem = await FoodItem.findById(foodItemId);
  if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existing = cart.items.find((i) => i.foodItem.toString() === foodItemId);
  if (existing) {
    existing.quantity += quantity || 1;
  } else {
    cart.items.push({ foodItem: foodItemId, quantity: quantity || 1 });
  }

  await cart.save();
  await cart.populate('items.foodItem');
  res.json(cart);
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find((i) => i.foodItem.toString() === req.params.foodItemId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.foodItem.toString() !== req.params.foodItemId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.foodItem');
  res.json(cart);
};

const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((i) => i.foodItem.toString() !== req.params.foodItemId);
  await cart.save();
  await cart.populate('items.foodItem');
  res.json(cart);
};

const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
