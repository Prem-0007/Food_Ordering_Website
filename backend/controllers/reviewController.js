const Review = require('../models/Review');
const FoodItem = require('../models/FoodItem');

const recalcRating = async (foodItemId) => {
  const reviews = await Review.find({ foodItem: foodItemId });
  const ratingCount = reviews.length;
  const avgRating = ratingCount ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount : 0;
  await FoodItem.findByIdAndUpdate(foodItemId, { avgRating: Math.round(avgRating * 10) / 10, ratingCount });
};

const getReviews = async (req, res) => {
  const reviews = await Review.find({ foodItem: req.params.foodItemId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ message: 'Rating is required' });

  const foodItem = await FoodItem.findById(req.params.foodItemId);
  if (!foodItem) return res.status(404).json({ message: 'Food item not found' });

  let review = await Review.findOne({ foodItem: req.params.foodItemId, user: req.user._id });
  if (review) {
    review.rating = rating;
    review.comment = comment || '';
    await review.save();
  } else {
    review = await Review.create({
      foodItem: req.params.foodItemId,
      user: req.user._id,
      rating,
      comment: comment || ''
    });
  }

  await recalcRating(req.params.foodItemId);
  res.status(201).json(review);
};

module.exports = { getReviews, addReview };
