const { Router } = require('express');
const { getWishlist, addProduct, removeProduct } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth');

const router = Router();

router.get('/', protect, getWishlist);
router.post('/products', protect, addProduct);
router.delete('/products/:productId', protect, removeProduct);

module.exports = router;
