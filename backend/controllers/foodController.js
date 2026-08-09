const FoodItem = require('../models/FoodItem');

const getFoodItems = async (req, res) => {
  const { search, category, sort, veg } = req.query;
  const query = {};

  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (veg === 'true') query.isVeg = true;

  let sortOption = { createdAt: -1 };
  if (sort === 'priceLow') sortOption = { price: 1 };
  if (sort === 'priceHigh') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { avgRating: -1 };

  const items = await FoodItem.find(query).sort(sortOption);
  res.json(items);
};

const getFoodItem = async (req, res) => {
  const item = await FoodItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Food item not found' });
  res.json(item);
};

const createFoodItem = async (req, res) => {
  const { name, description, price, category, imageUrl, isVeg, isAvailable } = req.body;

  if (!name || !description || price == null || !category) {
    return res.status(400).json({ message: 'Missing required food item fields' });
  }

  const item = await FoodItem.create({
    name,
    description,
    price,
    category,
    imageUrl: imageUrl || '',
    isVeg: isVeg !== false,
    isAvailable: isAvailable !== false
  });

  res.status(201).json(item);
};

const updateFoodItem = async (req, res) => {
  const item = await FoodItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Food item not found' });

  const { name, description, price, category, imageUrl, isVeg, isAvailable } = req.body;
  Object.assign(item, { name, description, price, category, imageUrl, isVeg, isAvailable });
  await item.save();
  res.json(item);
};

const deleteFoodItem = async (req, res) => {
  const item = await FoodItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Food item not found' });

  await item.deleteOne();
  res.json({ message: 'Food item removed' });
};

module.exports = { getFoodItems, getFoodItem, createFoodItem, updateFoodItem, deleteFoodItem };
