const WorkType = require('../models/WorkType');
const ApiError = require('../utils/ApiError');

const getWorkTypes = async (req, res, next) => {
  try {
    const workTypes = await WorkType.find({ isActive: true }).sort('name');
    res.json({ success: true, data: { workTypes } });
  } catch (error) {
    next(error);
  }
};

const createWorkType = async (req, res, next) => {
  try {
    const workType = await WorkType.create(req.body);
    res.status(201).json({ success: true, data: { workType } });
  } catch (error) {
    next(error);
  }
};

const updateWorkType = async (req, res, next) => {
  try {
    const workType = await WorkType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!workType) throw ApiError.notFound('Work type not found');
    res.json({ success: true, data: { workType } });
  } catch (error) {
    next(error);
  }
};

const deleteWorkType = async (req, res, next) => {
  try {
    const workType = await WorkType.findByIdAndDelete(req.params.id);
    if (!workType) throw ApiError.notFound('Work type not found');
    res.json({ success: true, message: 'Work type deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkTypes, createWorkType, updateWorkType, deleteWorkType };
