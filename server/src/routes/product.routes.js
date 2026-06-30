const { Router } = require('express');
const {
  getProducts, getProduct, getFeatured, getNewArrivals, getRelated,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/new-arrivals', getNewArrivals);
router.get('/related/:id', getRelated);
router.get('/:slug', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
