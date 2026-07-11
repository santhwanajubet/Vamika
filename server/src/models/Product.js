const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  colorCode: { type: String, default: '' },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: [String],
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  images: [String],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  offerPrice: {
    type: Number,
    min: [0, 'Compare price must be positive'],
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price must be positive'],
  },
  variants: [variantSchema],
  tags: [String],
  material: { type: String, default: '' },
  workType: { type: String, default: '' },
  occasion: { type: String, default: '' },
  length: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  avgRating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ material: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1, isNew: 1 });
productSchema.index({ soldCount: -1 });

productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

productSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

productSchema.virtual('hasDiscount').get(function () {
  return this.offerPrice > this.price;
});

module.exports = mongoose.model('Product', productSchema);
