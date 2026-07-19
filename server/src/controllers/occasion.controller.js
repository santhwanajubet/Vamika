const Occasion = require('../models/Occasion');
const ApiError = require('../utils/ApiError');

const getOccasions = async (req, res, next) => {
  try {
    const occasions = await Occasion.find({ isActive: true }).sort('name');
    res.json({ success: true, data: { occasions } });
  } catch (error) {
    next(error);
  }
};

const createOccasion = async (req, res, next) => {
  try {
    const occasion = await Occasion.create(req.body);
    res.status(201).json({ success: true, data: { occasion } });
  } catch (error) {
    next(error);
  }
};

const updateOccasion = async (req, res, next) => {
  try {
    const occasion = await Occasion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!occasion) throw ApiError.notFound('Occasion not found');
    res.json({ success: true, data: { occasion } });
  } catch (error) {
    next(error);
  }
};

const deleteOccasion = async (req, res, next) => {
  try {
    const occasion = await Occasion.findByIdAndDelete(req.params.id);
    if (!occasion) throw ApiError.notFound('Occasion not found');
    res.json({ success: true, message: 'Occasion deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOccasions, createOccasion, updateOccasion, deleteOccasion };
