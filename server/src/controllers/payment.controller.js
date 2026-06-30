const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');

const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) throw ApiError.notFound('Order not found');
    if (order.paymentStatus === 'paid') throw ApiError.badRequest('Order already paid');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
    });

    order.paymentId = paymentIntent.id;
    await order.save();

    res.json({ success: true, data: { clientSecret: paymentIntent.client_secret } });
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        { paymentStatus: 'paid' }
      );
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        { paymentStatus: 'failed' }
      );
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

const refund = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    if (order.paymentStatus !== 'paid') throw ApiError.badRequest('Order is not paid');

    await stripe.refunds.create({ paymentIntent: order.paymentId });

    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Refunded' });
    await order.save();

    res.json({ success: true, message: 'Refund processed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPaymentIntent, handleWebhook, refund };
