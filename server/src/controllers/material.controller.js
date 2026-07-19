const Material = require('../models/Material');
const ApiError = require('../utils/ApiError');

const getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find({ isActive: true }).sort('name');
    res.json({ success: true, data: { materials } });
  } catch (error) {
    next(error);
  }
};

const createMaterial = async (req, res, next) => {
  try {
    const material = await Material.create(req.body);
    res.status(201).json({ success: true, data: { material } });
  } catch (error) {
    next(error);
  }
};

const updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!material) throw ApiError.notFound('Material not found');
    res.json({ success: true, data: { material } });
  } catch (error) {
    next(error);
  }
};

const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) throw ApiError.notFound('Material not found');
    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMaterials, createMaterial, updateMaterial, deleteMaterial };
