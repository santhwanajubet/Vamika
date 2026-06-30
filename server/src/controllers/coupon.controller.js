const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal, products } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) throw ApiError.notFound('Invalid coupon code');

    if (Date.now() < coupon.validFrom) throw ApiError.badRequest('Coupon is not yet active');
    if (Date.now() > coupon.validUntil) throw ApiError.badRequest('Coupon has expired');
    if (coupon.isAtLimit) throw ApiError.badRequest('Coupon usage limit reached');

    if (coupon.usedBy.includes(req.user._id)) {
      const userCount = coupon.usedBy.filter((id) => id.toString() === req.user._id.toString()).length;
      if (userCount >= coupon.perUserLimit) {
        throw ApiError.badRequest('You have already used this coupon');
      }
    }

    if (cartTotal < coupon.minCartValue) {
      throw ApiError.badRequest(`Minimum cart value of ₹${coupon.minCartValue} required`);
    }

    if (coupon.applicableProducts.length > 0 && products) {
      const applicable = products.some((p) => coupon.applicableProducts.includes(p));
      if (!applicable) throw ApiError.badRequest('Coupon not applicable to items in cart');
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    res.json({
      success: true,
      data: {
        coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
        discount: Math.round(discount * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, data: { coupons } });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
    res.status(201).json({ success: true, data: { coupon } });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) throw ApiError.notFound('Coupon not found');
    res.json({ success: true, data: { coupon } });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw ApiError.notFound('Coupon not found');
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
