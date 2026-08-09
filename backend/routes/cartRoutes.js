const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:foodItemId', updateCartItem);
router.delete('/:foodItemId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
