const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId, isApproved: true });

    res.json({
      success: true,
      data: { reviews, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) throw ApiError.conflict('You already reviewed this product');

    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      status: 'delivered',
    });
    if (!order) throw ApiError.forbidden('You can only review products you have received');

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: order?._id,
      rating,
      title,
      comment,
    });

    res.status(201).json({ success: true, data: { review } });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) throw ApiError.notFound('Review not found');

    review.rating = req.body.rating ?? review.rating;
    review.title = req.body.title ?? review.title;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    res.json({ success: true, data: { review } });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) throw ApiError.notFound('Review not found');
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;
    const filter = {};
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name slug')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: { reviews, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    next(error);
  }
};

const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true }
    );
    if (!review) throw ApiError.notFound('Review not found');
    res.json({ success: true, data: { review } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews, createReview, updateReview, deleteReview, getAllReviews, approveReview,
};
