const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const getCategories = async (req, res, next) => {
  try {
    const { parent } = req.query;
    const filter = { isActive: true };
    if (parent === 'null') filter.parent = null;
    else if (parent) filter.parent = parent;

    const categories = await Category.find(filter).sort('order');
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw ApiError.notFound('Category not found');

    const children = await Category.find({ parent: category._id, isActive: true });

    res.json({ success: true, data: { category, children } });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) throw ApiError.notFound('Category not found');
    res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw ApiError.notFound('Category not found');

    await Category.updateMany({ parent: category._id }, { parent: null });

    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
};
