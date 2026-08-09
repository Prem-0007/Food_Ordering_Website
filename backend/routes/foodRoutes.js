const express = require('express');
const router = express.Router();
const {
  getFoodItems,
  getFoodItem,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem
} = require('../controllers/foodController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getFoodItems);
router.get('/:id', getFoodItem);
router.post('/', protect, requireRole('admin'), createFoodItem);
router.put('/:id', protect, requireRole('admin'), updateFoodItem);
router.delete('/:id', protect, requireRole('admin'), deleteFoodItem);

module.exports = router;
