const mongoose = require('mongoose');
const crypto = require('crypto');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  image: String,
  size: String,
  color: String,
  sku: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    unique: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: String, default: '' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed',
  },
  statusHistory: [statusHistorySchema],
  trackingNumber: { type: String, default: '' },
  deliveredAt: { type: Date },
  notes: { type: String, default: '' },
}, { timestamps: true, suppressReservedKeysWarning: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.pre('save', function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.orderNumber = `LS-${dateStr}-${rand}`;
  }

  if (this.isNew) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
