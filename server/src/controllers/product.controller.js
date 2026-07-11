const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const getProducts = async (req, res, next) => {
  try {
    const {
      search, category, material, occasion, workType,
      minPrice, maxPrice,
      size, color,
      sort = '-createdAt',
      page = 1, limit = 12,
      featured, isNew,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (material) filter.material = material;
    if (occasion) filter.occasion = occasion;
    if (workType) filter.workType = workType;
    if (featured === 'true') filter.featured = true;
    if (isNew === 'true') filter.isNew = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (size) {
      filter['variants.size'] = size;
    }
    if (color) {
      filter['variants.color'] = { $regex: color, $options: 'i' };
    }

    let sortOption;
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { avgRating: -1 }; break;
      case 'sold': sortOption = { soldCount: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);

    const product = await (isObjectId
      ? Product.findById(slug)
      : Product.findOne({ slug })
    )
      .populate('category', 'name slug');

    if (!product || !product.isActive) throw ApiError.notFound('Product not found');

    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const getFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort('-createdAt');
    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({ isNew: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8)
      .sort('-createdAt');
    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

const getRelated = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw ApiError.notFound('Product not found');

    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4)
      .sort('-createdAt');

    res.json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw ApiError.notFound('Product not found');
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) throw ApiError.notFound('Product not found');
    res.json({ success: true, message: 'Product archived' });
  } catch (error) {
    next(error);
  }
};

const bulkDeleteProducts = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw ApiError.badRequest('Provide an array of product IDs');
    }
    const result = await Product.updateMany({ _id: { $in: ids } }, { isActive: false });
    res.json({ success: true, message: `${result.modifiedCount} products archived` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts, getProduct, getFeatured, getNewArrivals, getRelated,
  createProduct, updateProduct, deleteProduct, bulkDeleteProducts,
};
