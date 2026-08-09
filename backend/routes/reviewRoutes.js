const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:foodItemId', getReviews);
router.post('/:foodItemId', protect, addReview);

module.exports = router;
