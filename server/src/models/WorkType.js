const mongoose = require('mongoose');

const workTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Work type name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

workTypeSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('WorkType', workTypeSchema);
