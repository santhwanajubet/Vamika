const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const ApiError = require('../utils/ApiError');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) throw ApiError.notFound('Order not found');
    if (order.paymentStatus === 'paid') throw ApiError.badRequest('Order already paid');

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId: order._id.toString() },
    });

    order.paymentId = rzpOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      throw ApiError.badRequest('Invalid payment signature');
    }

    const order = await Order.findOne({ paymentId: razorpay_order_id });
    if (!order) throw ApiError.notFound('Order not found');

    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.statusHistory.push({ status: 'confirmed', note: 'Payment received' });
    await order.save();

    const cart = await Cart.findOne({ user: order.user });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPaymentOrder, verifyPayment };
