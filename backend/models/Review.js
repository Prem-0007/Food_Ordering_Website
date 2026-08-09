const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

reviewSchema.index({ foodItem: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
