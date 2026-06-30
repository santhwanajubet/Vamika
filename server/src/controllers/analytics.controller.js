const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const getSummary = async (req, res, next) => {
  try {
    const [orders, revenueResult, users, products] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders: orders,
        totalRevenue: revenueResult[0]?.total || 0,
        totalUsers: users,
        activeProducts: products,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRevenueOverTime = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const data = await Order.aggregate([
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

    res.json({ success: true, data: { revenueOverTime: data } });
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort('-soldCount')
      .limit(10)
      .select('name slug price soldCount images');

    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

const getOrdersByStatus = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { ordersByStatus: data } });
  } catch (error) {
    next(error);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const { threshold = 5 } = req.query;
    const products = await Product.find({
      isActive: true,
      variants: { $elemMatch: { stock: { $lte: Number(threshold) } } },
    }).select('name slug variants');

    const lowStock = products.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      variants: p.variants.filter((v) => v.stock <= Number(threshold)),
    }));

    res.json({ success: true, data: { lowStock } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary, getRevenueOverTime, getTopProducts, getOrdersByStatus, getLowStock };
