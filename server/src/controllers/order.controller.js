const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'razorpay', paymentId, couponCode, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Cart is empty');
    }

    let subtotal = 0;
    const orderItems = [];
    const productUpdates = [];

    for (const item of cart.items) {
      const product = item.product;
      const variant = product.variants.find((v) => v.sku === item.variantSku);
      if (!variant || variant.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for ${product.name} (${item.variantSku})`);
      }

      const price = product.offerPrice || product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        price,
        quantity: item.quantity,
      });

      subtotal += price * item.quantity;
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id, 'variants.sku': variant.sku },
          update: { $inc: { 'variants.$.stock': -item.quantity, soldCount: item.quantity } },
        },
      });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && Date.now() >= coupon.validFrom && Date.now() <= coupon.validUntil && !coupon.isAtLimit) {
        if (subtotal >= coupon.minCartValue) {
          discount = coupon.type === 'percentage'
            ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity)
            : coupon.value;

          coupon.usedCount += 1;
          coupon.usedBy.push(req.user._id);
          await coupon.save();
        }
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentId,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      couponCode: couponCode || '',
      shippingCost: subtotal >= 2500 ? 0 : 99,
      tax: 0,
      total: Math.round((subtotal - discount + (subtotal >= 2500 ? 0 : 99)) * 100) / 100,
    });

    await Product.bulkWrite(productUpdates);

    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) throw ApiError.notFound('Order not found');
    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) throw ApiError.notFound('Order not found');

    if (!['confirmed', 'processing'].includes(order.status)) {
      throw ApiError.badRequest('Order cannot be cancelled at this stage');
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Cancelled by customer' });
    await order.save();

    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.product, 'variants.sku': item.sku },
        { $inc: { 'variants.$.stock': item.quantity, soldCount: -item.quantity } }
      );
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, note } = req.body;
    const validTransitions = {
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    if (!validTransitions[order.status]?.includes(status)) {
      throw ApiError.badRequest(`Cannot transition from ${order.status} to ${status}`);
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || '' });

    if (status === 'shipped' && trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus,
};
