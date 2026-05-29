const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

exports.getStats = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders, monthOrders, lastMonthOrders,
    totalRevenue, monthRevenue, lastMonthRevenue,
    totalUsers, monthUsers,
    totalProducts, lowStockProducts,
    pendingOrders, recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([{ $match: { paymentStatus: 'paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    User.countDocuments({ role: 'client' }),
    User.countDocuments({ role: 'client', createdAt: { $gte: startOfMonth } }),
    Product.countDocuments({ isActive: true }),
    Product.aggregate([
      { $unwind: '$variants' },
      { $match: { 'variants.stock': { $lt: 5 } } },
      { $group: { _id: '$_id', name: { $first: '$name' }, minStock: { $min: '$variants.stock' } } },
    ]),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 }).limit(10),
  ]);

  const calcGrowth = (curr, prev) =>
    prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);

  ApiResponse.success(res, {
    orders: {
      total: totalOrders,
      thisMonth: monthOrders,
      growth: calcGrowth(monthOrders, lastMonthOrders),
      pending: pendingOrders,
    },
    revenue: {
      total: totalRevenue[0]?.total || 0,
      thisMonth: monthRevenue[0]?.total || 0,
      growth: calcGrowth(monthRevenue[0]?.total || 0, lastMonthRevenue[0]?.total || 0),
    },
    users: { total: totalUsers, thisMonth: monthUsers },
    products: { total: totalProducts, lowStock: lowStockProducts },
    recentOrders,
  });
};

exports.getSalesChart = async (req, res) => {
  const { period = '7d' } = req.query;
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const salesData = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  ApiResponse.success(res, { salesData });
};

exports.getTopProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ salesCount: -1 })
    .limit(10)
    .select('name images price salesCount averageRating');
  ApiResponse.success(res, { products });
};

exports.getOrderStatusChart = async (req, res) => {
  const statusData = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);
  ApiResponse.success(res, { statusData });
};
