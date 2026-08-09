const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');

const getAdminDashboard = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalFoodItems = await FoodItem.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const pendingOrders = await Order.countDocuments({ status: 'pending' });

  const revenueAgg = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

  res.json({ totalOrders, totalFoodItems, totalCustomers, pendingOrders, totalRevenue });
};

const getReports = async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const topSelling = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.name', quantitySold: { $sum: '$items.quantity' } } },
    { $sort: { quantitySold: -1 } },
    { $limit: 8 }
  ]);

  const categoryRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'fooditems',
        localField: 'items.foodItem',
        foreignField: '_id',
        as: 'foodDoc'
      }
    },
    { $unwind: '$foodDoc' },
    {
      $group: {
        _id: '$foodDoc.category',
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { revenue: -1 } }
  ]);

  const statusBreakdown = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({ dailyOrders, topSelling, categoryRevenue, statusBreakdown });
};

module.exports = { getAdminDashboard, getReports };
