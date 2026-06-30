const Address = require('../models/Address');
const ApiError = require('../utils/ApiError');

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json({ success: true, data: { addresses } });
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id };

    if (data.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create(data);
    res.status(201).json({ success: true, data: { address } });
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) throw ApiError.notFound('Address not found');

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id, _id: { $ne: address._id } }, { isDefault: false });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({ success: true, data: { address } });
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) throw ApiError.notFound('Address not found');
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };
