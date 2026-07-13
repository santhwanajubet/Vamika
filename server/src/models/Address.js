const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  label: { type: String, default: 'Home' },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  line1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true,
  },
  line2: { type: String, default: '', trim: true },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    default: 'India',
  },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

addressSchema.index({ user: 1 });

module.exports = mongoose.model('Address', addressSchema);
