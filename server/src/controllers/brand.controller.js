const Brand = require('../models/Brand');
const ApiError = require('../utils/ApiError');

const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort('name');
    res.json({ success: true, data: { brands } });
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: { brand } });
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) throw ApiError.notFound('Brand not found');
    res.json({ success: true, data: { brand } });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) throw ApiError.notFound('Brand not found');
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
