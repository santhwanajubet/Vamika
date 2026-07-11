const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name slug price images variants');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId, variantSku, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');

    const variant = product.variants.find((v) => v.sku === variantSku);
    if (!variant) throw ApiError.badRequest('Variant not found');
    if (variant.stock < quantity) throw ApiError.badRequest('Insufficient stock');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find((i) => i.variantSku === variantSku);
    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity > variant.stock) {
        throw ApiError.badRequest('Insufficient stock');
      }
    } else {
      cart.items.push({
        product: productId,
        variantSku,
        quantity,
        price: product.offerPrice || product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name slug price images variants');

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { variantSku } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw ApiError.notFound('Cart not found');

    const item = cart.items.find((i) => i.variantSku === variantSku);
    if (!item) throw ApiError.notFound('Item not found in cart');

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.variantSku !== variantSku);
    } else {
      const product = await Product.findById(item.product);
      if (!product) throw ApiError.notFound('Product not found');

      const variant = product.variants.find((v) => v.sku === variantSku);
      if (variant && quantity > variant.stock) {
        throw ApiError.badRequest('Insufficient stock');
      }

      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name slug price images variants');

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw ApiError.notFound('Cart not found');

    cart.items = cart.items.filter((i) => i.variantSku !== req.params.variantSku);
    await cart.save();
    await cart.populate('items.product', 'name slug price images variants');

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared', data: { cart } });
  } catch (error) {
    next(error);
  }
};

const mergeCart = async (req, res, next) => {
  try {
    const { guestItems } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    for (const guestItem of guestItems) {
      const existing = cart.items.find((i) => i.variantSku === guestItem.variantSku);
      if (existing) {
        existing.quantity += guestItem.quantity;
      } else {
        const product = await Product.findById(guestItem.productId);
        if (product) {
          cart.items.push({
            product: guestItem.productId,
            variantSku: guestItem.variantSku,
            quantity: guestItem.quantity,
            price: product.offerPrice || product.price,
          });
        }
      }
    }

    await cart.save();
    await cart.populate('items.product', 'name slug price images variants');

    res.json({ success: true, data: { cart } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, mergeCart };
