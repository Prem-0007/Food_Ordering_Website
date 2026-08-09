const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

router.post('/', placeOrder);
router.get('/mine', getMyOrders);
router.get('/', requireRole('admin'), getAllOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', requireRole('admin'), updateOrderStatus);

module.exports = router;
